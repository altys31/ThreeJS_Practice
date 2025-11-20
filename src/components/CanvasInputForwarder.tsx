import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

type Props = {
  rootRef?: React.RefObject<THREE.Object3D>;
  throttleMs?: number; // 최소 간격 (ms)
  minMovePx?: number; // 최소 이동 픽셀
};

export function CanvasInputForwarder({ rootRef, throttleMs = 50, minMovePx = 2 }: Props) {
  const { gl, camera, scene } = useThree();
  const lastTime = useRef(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const rafPending = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!gl || !camera || !scene) return;

    const handler = (ev: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const cx = ev.clientX - rect.left;
      const cy = ev.clientY - rect.top;
      const now = performance.now();

      // movement threshold
      const last = lastPos.current;
      if (last) {
        const dx = cx - last.x;
        const dy = cy - last.y;
        if (Math.hypot(dx, dy) < minMovePx && now - lastTime.current < throttleMs) {
          return;
        }
      }

      lastPos.current = { x: cx, y: cy };

      // throttle by requestAnimationFrame (one raycast per frame max)
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        lastTime.current = now;

        const rect2 = gl.domElement.getBoundingClientRect();
        const nx = (cx / rect2.width) * 2 - 1;
        const ny = -((cy / rect2.height) * 2 - 1);
        pointer.current.set(nx, ny);

        raycaster.current.setFromCamera(pointer.current, camera);

        const root = rootRef?.current;
        const targets = root ? (root.children ? root.children : [root]) : scene.children;
        try {
          const intersects = raycaster.current.intersectObjects(targets as THREE.Object3D[], true);
          if (intersects.length > 0) {
            const first = intersects[0];
            const obj: any = first.object;
            if (obj?.userData?.onPointerHit) {
              try {
                obj.userData.onPointerHit(first, ev);
              } catch (err) {
                // swallowing handler errors
                console.error("onPointerHit handler error", err);
              }
            }
          }
        } catch (err) {
          console.error("raycast error", err);
        }
      });
    };

    window.addEventListener("pointermove", handler, { capture: true });
    window.addEventListener("pointerdown", handler, { capture: true });

    return () => {
      window.removeEventListener("pointermove", handler, { capture: true });
      window.removeEventListener("pointerdown", handler, { capture: true });
    };
  }, [gl, camera, scene, rootRef, throttleMs, minMovePx]);

  return null;
}
