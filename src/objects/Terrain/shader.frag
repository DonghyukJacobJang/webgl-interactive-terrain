varying vec3 vNewPosition;

void main() {
  gl_FragColor = vec4(vec3(0.7, vNewPosition.y + 0.6, 0.7), 1.0);
}
