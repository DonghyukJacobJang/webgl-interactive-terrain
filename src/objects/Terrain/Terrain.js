import {
  BufferAttribute, FaceColors, Mesh, PlaneBufferGeometry, RepeatWrapping, ShaderMaterial, TextureLoader, Vector2
} from 'three';

import { TweenLite } from 'gsap';
import 'gsap/EndArrayPlugin';

import { IMAGE_PATH } from '../../util/constants';

const fragShader = require('./shader.frag');
const vertShader = require('./shader.vert');

const resetArray = [];

export default class Terrain {

  constructor() {
    const loader = new TextureLoader();
    const bumpTexture = loader.load(`${IMAGE_PATH}mask_with_height.png`);
    bumpTexture.wrapT = RepeatWrapping;
    bumpTexture.wrapS = bumpTexture.wrapT;

    const geometry = new PlaneBufferGeometry(10, 10, 32, 32);
    geometry.rotateX(- Math.PI / 2);

    this.attributes = {
      displacement: {
        type: 'f',
        value: []
      }
    };

    this.attributes.displacement.value = geometry.attributes.position.array.map((item, i) => {
      resetArray[i] = 0;
      return 0;
    });

    geometry.addAttribute('displacement', new BufferAttribute(this.attributes.displacement.value, 1));

    this.sMaterial = new ShaderMaterial({
      uniforms: {
        amplitude: { type: 'f', value: 0 },
        mouse: { type: 'v2', value: new Vector2(0, 0) },
        bumpTexture: { type: "t", value: bumpTexture },
        bumpScale: { type: "f", value: 1.0 }
      },
      wireframe: true,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      vertexColors: FaceColors
    });

    this.mesh = new Mesh(geometry, this.sMaterial);

    this.frame = 0;
  }

  update(mouse) {
    this.frame += 0.02;
    this.sMaterial.uniforms.amplitude.value = this.frame;
    this.sMaterial.uniforms.mouse.value = mouse;
  }

  updateDisplacement(face) {
    this.frame = 0;

    const resetFace = () => {
      if (this.oldFace) {
        resetArray[this.oldFace.a] = 0;
        resetArray[this.oldFace.b] = 0;
        resetArray[this.oldFace.c] = 0;
        TweenLite.to(this.mesh.geometry.attributes.displacement.array, 0.3, { endArray: resetArray });
      }
    };

    if (!face ) {
      resetFace();
    }

    if (this.oldFace !== face) {
      if (this.oldFace) {
        resetFace();
      }

      this.oldFace = face;

      resetArray[face.a] = Math.random() * 0.1 + 0.1;
      resetArray[face.b] = Math.random() * 0.1 + 0.1;
      resetArray[face.c] = Math.random() * 0.1 + 0.1;
      TweenLite.to(this.mesh.geometry.attributes.displacement.array, 0.3, { endArray: resetArray });

      this.mesh.geometry.attributes.displacement.needsUpdate = true;
    }
  }

}
