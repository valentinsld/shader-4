import * as THREE from 'three'

import vertexShader from '../shaders/island.vert'
import fragmentShader from '../shaders/island.frag'

class Island {
  constructor({ scene }) {
    Object.assign(this, { scene })

    this.params = {
      width: 6,
    }

    this.init()
    this.addLight()
  }

  init() {
    const plane = new THREE.PlaneGeometry(this.params.width, this.params.width, 512, 512)

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color('#1c1a1a') },
      },
    })

    this.mesh = new THREE.Mesh(plane, material)
    this.mesh.position.y = -0.5
    this.mesh.rotation.x = -Math.PI * 0.5

    this.scene.add(this.mesh)
  }

  addLight() {
    this.light = new THREE.PointLight('#2560b6', 0.5)
    this.scene.add(this.light)
  }
}

export default Island
