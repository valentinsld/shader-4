import * as THREE from 'three'
// import { Reflector } from 'three/examples/jsm/objects/Reflector'
import Reflector from './jsm/Reflector'

import vertexShader from '../shaders/mirrorIsland.vert'
import fragmentShader from '../shaders/mirrorIsland.frag'

class MirrorIsland {
  constructor({ scene, gui }) {
    const geometry = new THREE.PlaneGeometry(5, 5, 512, 512)

    const params = {
      color: '#626470',
    }

    const shader = {
      uniforms: {
        color: {
          value: null,
        },
        uColor: { value: new THREE.Color(params.color) },
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

    gui.addColor(params, 'color').onChange((v) => {
      verticalMirror.material.uniforms.uColor.value = new THREE.Color(v)
    })
  }
}

export default MirrorIsland
