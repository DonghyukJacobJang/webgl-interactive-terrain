uniform float amplitude;
uniform vec2 mouse;
uniform sampler2D bumpTexture;
uniform float bumpScale;

attribute float displacement;

varying vec3 vNewPosition;
varying vec2 vUv;
varying float vAmount;

void main() {
  vUv = uv;
  vec4 bumpData = texture2D(bumpTexture, uv);
  vAmount = bumpData.r;

  float dist = sin(amplitude) * 0.5 + 0.5;

  vec3 newPosition = vec3(0.0);

  if (displacement > 0.0) {
    newPosition = position + normal * bumpScale * vAmount + normal * vec3(displacement * dist);
  } else {
    newPosition = position + normal * bumpScale * vAmount;
  }

  vNewPosition = newPosition;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}
