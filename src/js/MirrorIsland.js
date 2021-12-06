import * as THREE from 'three'
// import { Reflector } from 'three/examples/jsm/objects/Reflector'
import Reflector from './jsm/Reflector'

import vertexShader from '../shaders/mirrorIsland.vert'
import fragmentShader from '../shaders/mirrorIsland.frag'
import ParticularWind from './partcularWind'

class MirrorIsland {
  constructor({ scene, renderer, gui }) {
    const geometry = new THREE.PlaneGeometry(5, 5, 512, 512)

    this.renderScene = new THREE.Scene()
    this.particules = new ParticularWind({ scene: this.renderScene, renderer, gui })

    // TODO : remove
    // scene.add(this.renderScene)

    const shader = {
      uniforms: {
        color: {
          value: null,
        },
        tDiffuse: {
          value: null,
        },
        textureMatrix: {
          value: null,
        },
      },
      vertexShader,
      fragmentShader,
    }

    this.verticalMirror = new Reflector(
      geometry,
      {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x889999,
        shader,
      },
      this.renderScene,
    )
    this.verticalMirror.position.y = 0.1
    this.verticalMirror.rotateX(-Math.PI / 2)
    scene.add(this.verticalMirror)
  }

  update(t) {
    this.particules.update(t)
  }
}

export default MirrorIsland
