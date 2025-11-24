varying vec2 vUv; //vUv가 뭐임 -> vertexShader에서 넘겨준 uv좌표 -> 그럼 uv좌표 는 뭐임 -> 텍스처 좌표계 
varying float vDisplacement; // ← Vertex Shader에서 받아야 함

void main() {
  // 기본 물 색상
  vec3 color = vec3(0.2, 0.4, 0.8); // 파란색 물
  gl_FragColor = vec4(color, 1.0);
}