varying vec2 vUv;
varying float vDisplacement;

void main() {
  // 기본 물 색상 (깊은 파란색)
  vec3 deepWater = vec3(0.05, 0.15, 0.3);
  vec3 shallowWater = vec3(0.15, 0.35, 0.55);
  
  // 깊이감 (UV 기반)
  vec3 baseColor = mix(deepWater, shallowWater, vUv.y * 0.3);
  
  // 파동 하이라이트 (물방울이 튀는 부분)
  float rippleHighlight = smoothstep(0.0, 0.02, abs(vDisplacement)) * 
                          smoothstep(0.1, 0.02, abs(vDisplacement));
  
  // 밝은 물거품 색상
  vec3 foamColor = vec3(0.7, 0.85, 1.0);
  
  // 최종 색상 합성
  vec3 finalColor = baseColor + foamColor * rippleHighlight * 3.0;
  
  // 약간의 반짝임 추가
  float sparkle = smoothstep(0.03, 0.04, abs(vDisplacement));
  finalColor += vec3(1.0) * sparkle * 0.5;
  
  gl_FragColor = vec4(finalColor, 1.0);
}