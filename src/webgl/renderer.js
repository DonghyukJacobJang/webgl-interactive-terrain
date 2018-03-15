import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setScissorTest(true);

export default renderer;
