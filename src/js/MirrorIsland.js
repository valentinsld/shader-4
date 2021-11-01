import * as THREE from 'three'
// import { Reflector } from 'three/examples/jsm/objects/Reflector'
import Reflector from './jsm/Reflector'

import vertexShader from '../shaders/mirrorIsland.vert'
import fragmentShader from '../shaders/mirrorIsland.frag'

class MirrorIsland {
  constructor({ scene }) {
    const geometry = new THREE.PlaneGeometry(5, 5)

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

    const verticalMirror = new Reflector(
      geometry,
      {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x889999,
        shader,
      },
    )
    verticalMirror.position.y = 0.1
    verticalMirror.rotateX(-Math.PI / 2)
    scene.add(verticalMirror)
  }
}

export default MirrorIsland
