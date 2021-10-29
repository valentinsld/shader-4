import * as THREE from 'three'

import vertexShader from '../shaders/particule.vert'
import fragmentShader from '../shaders/particule.frag'

class ParticularWind {
  constructor({ scene, renderer }) {
    Object.assign(this, { scene, renderer })

    this.params = {
      width: 0.5,
    }

    this.init()
  }

  init() {
    //
    // geometry
    //
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 1948

    const positions = new Float32Array(count * 3)
    const elevation = new Float32Array(count)
    let lasElevation = 0

    for (let i = 0; i < count; i++) {
      const i3 = 3 * i
      positions[i3] = 0 + this.params.width * Math.cos(i * 0.1)
      positions[i3 + 1] = this.params.width * Math.sin(i * 0.1)
      positions[i3 + 2] = 0

      elevation[i] = i * 0.003
    }
    console.log(elevation)
    lasElevation = elevation[count - 1]

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('aElevation', new THREE.BufferAttribute(elevation, 1))

    //
    // Material
    //
    const particlesMaterial = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 50 * this.renderer.getPixelRatio() },
        uLastElevation: { value: lasElevation },
      },
    })

    this.mesh = new THREE.Points(particlesGeometry, particlesMaterial)
    this.scene.add(this.mesh)
  }

  update(t) {
    this.mesh.material.uniforms.uTime.value = t * 0.3
    this.mesh.rotation.z = t * 0.5
  }
}

export default ParticularWind
