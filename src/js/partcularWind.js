import * as THREE from 'three'

import vertexShader from '../shaders/particule.vert'
import fragmentShader from '../shaders/particule.frag'

const PARAMS = {
  widthCircle: 0.5,
  sizeParticules: 42,
  color1: '#32b3dc', // #dcb504
  color2: '#2560b6', // #c8321f
}

class ParticularWind {
  constructor({ scene, renderer, gui, params = {}, senseRotation = +1, speed = 0.3 }) {
    Object.assign(this, { scene, renderer, gui, senseRotation, speed })

    this.count = 1948 * 2
    this.params = Object.assign(PARAMS, params)

    this.init()
  }

  init() {
    //
    // geometry
    //
    const particlesGeometry = new THREE.BufferGeometry()
    const { count } = this

    const positions = new Float32Array(count * 3)
    const randomPosition = new Float32Array(count * 3)
    const randomSize = new Float32Array(count)
    const elevation = new Float32Array(count)
    const color = new Float32Array(count * 3)
    let lasElevation = 0

    const color1 = new THREE.Color(this.params.color1)
    const color2 = new THREE.Color(this.params.color2)

    for (let i = 0; i < count; i++) {
      const i3 = 3 * i

      positions[i3] = 0 + this.params.widthCircle * Math.cos(i * 0.1)
      positions[i3 + 1] = this.params.widthCircle * Math.sin(i * 0.1)
      positions[i3 + 2] = 0

      randomPosition[i3] = (Math.random() - 0.5) * 0.35
      randomPosition[i3 + 1] = (Math.random() - 0.5) * 0.35
      randomPosition[i3 + 2] = (Math.random() - 0.5) * 0.35

      randomSize[i] = Math.max(Math.random() * 2, 0.3)

      elevation[i] = i * 0.001

      const particuleColor = new THREE.Color().lerpColors(
        color1, color2, Math.random(),
      )
      color[i3] = particuleColor.r
      color[i3 + 1] = particuleColor.g
      color[i3 + 2] = particuleColor.b
    }
    lasElevation = elevation[count - 1]

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('aRandomPosition', new THREE.BufferAttribute(randomPosition, 3))
    particlesGeometry.setAttribute('aRandomSize', new THREE.BufferAttribute(randomSize, 1))
    particlesGeometry.setAttribute('aElevation', new THREE.BufferAttribute(elevation, 1))
    particlesGeometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3))

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
        uSize: { value: this.params.sizeParticules * this.renderer.getPixelRatio() },
        uLastElevation: { value: lasElevation },
      },
    })

    this.mesh = new THREE.Points(particlesGeometry, particlesMaterial)
    this.scene.add(this.mesh)

    this.initGUI()
  }

  initGUI() {
    const folder = this.gui.addFolder(`Particules ${Math.random()}`)
    // TODO
    folder.add(this.params, 'sizeParticules', 10, 100).onChange((v) => {
      this.mesh.material.uniforms.uSize.value = v * this.renderer.getPixelRatio()
    })

    folder.addColor(this.params, 'color1').onChange(this.newColorParticules.bind(this))
    folder.addColor(this.params, 'color2').onChange(this.newColorParticules.bind(this))
  }

  newColorParticules() {
    const color1 = new THREE.Color(this.params.color1)
    const color2 = new THREE.Color(this.params.color2)

    const color = new Float32Array(this.count * 3)

    for (let i = 0; i < this.count; i++) {
      const i3 = 3 * i

      const particuleColor = new THREE.Color().lerpColors(
        color1, color2, Math.random(),
      )
      color[i3] = particuleColor.r
      color[i3 + 1] = particuleColor.g
      color[i3 + 2] = particuleColor.b
    }

    this.mesh.geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
  }

  update(t) {
    this.mesh.material.uniforms.uTime.value = t * this.speed * this.senseRotation
    this.mesh.rotation.z = t * 0.5
  }
}

export default ParticularWind
