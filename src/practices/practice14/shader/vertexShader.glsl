uniform float uTime;
uniform vec4 uRipples[10]; // x, z, time, strength

varying vec2 vUv;
varying float vDisplacement;

void main(){
  vUv = uv;
  vec3 pos = position;
  float displacement = 0.0;

  for(int i = 0; i<10; i++){
    if(i>= uRippleCount)
      break;
     
     vec2 rippleCenter = uRipples[i].xy;
     float rippleTime = uRipples[i].z;
     float rippleStrength = uRipples[i].w;

    float dist = distance(vec2(pos.x, pos.z), rippleCenter);
    float wave = sin(dist * 5.0 - rippleTime * 3.0) * 0.1;
    float fade = exp(-rippleTime * 1.0) / (1.0 + dist);
    
    displacement += wave * ringMask * timeFade * distanceFade * 0.06 * rippleStrength;
  }

  pos.y += displacement;
  vDisplacement = displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}