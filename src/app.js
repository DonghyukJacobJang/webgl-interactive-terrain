import { AxesHelper, GridHelper, Raycaster } from 'three';

import scene from './webgl/scene';
import renderer from './webgl/renderer';
import { camera } from './webgl/cameras';

import Terrain from './objects/Terrain/Terrain';

import OrbitControls from './lib/three/OrbitControls';
import RenderStats from './lib/three/render-stats';

import { DEV_HELPERS, DEV_STATS } from './util/constants';
import stats from './util/stats';

import './app.scss';

class App {

  constructor() {
    this.mouse = {
      x: 0,
      y: 0
    };
    document.body.appendChild(renderer.domElement);

    // Listeners
    window.addEventListener('resize', this.onResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);

    this.setHelpers();
    this.setStats();
    this.setOrbitControls();

    this.raycaster = new Raycaster();

    this.terrain = new Terrain();
    scene.add(this.terrain.mesh);

    this.update();
  }

  onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  onMouseMove = (ev) => {
    ev.preventDefault();
    this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (ev.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObject(this.terrain.mesh);

    if (intersects.length > 0) {
      const target = intersects[0];

      if (this.targetFace !== target.face) {

        this.targetFace = target.face;

        if (
          this.targetFace.a === target.face.a ||
          this.targetFace.b === target.face.b ||
          this.targetFace.c === target.face.c
        ) {
          this.terrain.updateDisplacement(this.targetFace);
        }
      }
    } else {
      this.terrain.updateDisplacement(false);
    }

  };

  setOrbitControls = () => {
    this.controls = {
      main: new OrbitControls(camera, renderer.domElement)
    };
  };

  setHelpers = () => {
    if (DEV_HELPERS) {
      scene.add(new GridHelper(10, 10));
      scene.add(new AxesHelper());
    }
  };

  setStats = () => {
    if (DEV_STATS) {
      this.renderStats = RenderStats();
      this.renderStats.domElement.style.position = 'absolute';
      this.renderStats.domElement.style.right = '0px';
      this.renderStats.domElement.style.bottom = '48px';
      document.body.appendChild(this.renderStats.domElement);
      document.body.appendChild(stats.domElement);
    }
  };

  render = (_camera, left, bottom, width, height) => {
    left *= window.innerWidth;
    bottom *= window.innerHeight;
    width *= window.innerWidth;
    height *= window.innerHeight;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setClearColor(0x121212);
    renderer.render(scene, _camera);
  }

  update = () => {
    requestAnimationFrame(this.update);

    if (DEV_STATS) {
      stats.begin();
    }

    this.controls.main.update();

    this.terrain.update(this.mouse);

    this.render(camera, 0, 0, 1, 1);

    if (DEV_STATS) {
      this.renderStats.update(renderer);
      stats.end();
    }
  };

}

export default new App();
