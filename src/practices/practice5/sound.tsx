import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const RawPositionalAudio = ({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) => {
  const { scene } = useGLTF("./piano.glb"); // glb 파일 경로
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null!); // ⬅️ 오디오를 여기에 붙임
  const sourceRef = useRef<THREE.PositionalAudio>(null!);

  const Mat = new THREE.MeshPhysicalMaterial({
    color: "#959682",
    transmission: 0.15,
    roughness: 0.2,
    thickness: 0.7,
  });

  scene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.material = Mat;
    }
  });
  useEffect(() => {
    // 1) AudioListener 준비
    let created = false;
    let listener = camera.children.find((c) => c.type === "AudioListener") as
      | THREE.AudioListener
      | undefined;
    if (!listener) {
      listener = new THREE.AudioListener();
      camera.add(listener);
      created = true;
    }

    // 2) PositionalAudio 생성 + 씬에 attach
    const audio = new THREE.PositionalAudio(listener);
    sourceRef.current = audio;
    groupRef.current.add(audio); // ⬅️ 실제로 붙이기
    // 정리 시 제거
    let disposed = false;
    const cleanupAttach = () => {
      if (audio.parent) audio.parent.remove(audio);
    };

    // 3) 버퍼 로드
    const loader = new THREE.AudioLoader();
    loader.load(
      "/bgm.mp3", // ⬅️ "/bgm.mp3" 같이 루트 경로
      (buffer) => {
        if (disposed) return;
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(1.5);
        audio.setRefDistance(2);
        audio.setMaxDistance(20);
        audio.setRolloffFactor(1);
        audio.setDistanceModel("inverse");
      },
      undefined,
      (err) => console.error("Audio load error:", err)
    );

    // 4) 리버브(선택): IR는 작은 impulse 파일로, 루트에서
    const ctx = listener.context;
    const convolver = ctx.createConvolver();
    const send = ctx.createGain();
    send.gain.value = 0;
    const wet = ctx.createGain();

    audio.getOutput().connect(send);
    send.connect(convolver);
    convolver.connect(wet);
    wet.connect(listener.getInput());
    (async () => {
      try {
        const res = await fetch("/impulse.wav"); // ⬅️ 작은 IR 파일 권장
        const buf = await res.arrayBuffer();
        if (!disposed) convolver.buffer = await ctx.decodeAudioData(buf);
      } catch (e) {
        console.warn("IR load failed (continuing without reverb)", e);
      }
    })();

    // 5) 거리 기반 센드 조절 + rAF 관리
    const temp = new THREE.Vector3();
    let raf = 0;
    const update = () => {
      const dist = camera.position.distanceTo(temp.set(position[0], position[1], position[2]));
      const t = Math.min(Math.max((dist - 10) / (24 - 4), 0), 1);
      const smooth = t * t * (3 - 2 * t);
      const target = 2 * smooth; // wet 상한
      send.gain.setTargetAtTime(target, ctx.currentTime, 0.03);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    // 6) 사용자 제스처로 재생/컨텍스트 resume
    const start = async () => {
      try {
        if (ctx.state !== "running") await ctx.resume();
        if (audio.isPlaying === false && audio.buffer) audio.play();
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("keydown", start);

    return () => {
      disposed = true;
      window.removeEventListener("keydown", start);
      cancelAnimationFrame(raf);
      audio.stop();
      audio.disconnect();
      send.disconnect();
      convolver.disconnect();
      wet.disconnect();
      cleanupAttach();
      if (created) camera.remove(listener!);
    };
  }, []);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} />
    </group>
  );
};
