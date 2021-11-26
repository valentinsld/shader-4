import * as THREE from 'three'

import vertexShader from '../shaders/particule.vert'
import fragmentShader from '../shaders/particule.frag'

const PARAMS = {
  widthCircle: 0.6,
  sizeParticules: 42,
  color1: '#f5f5f5',
  color2: '#9300fa',
  powerRandom: 3.5,
  radiusRandom: 0.2,
}

class ParticularWind {
  constructor({ scene, renderer, gui, params = {}, senseRotation = +1, speed = 0.65 }) {
    Object.assign(this, { scene, renderer, gui, senseRotation, speed })

    this.count = 1948 * 3
    this.params = Object.assign(PARAMS, params)

    this.initParticules()
  }

  initParticules() {
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

      positions[i3] = this.params.widthCircle * Math.cos(i * 0.013)
      positions[i3 + 1] = -1
      positions[i3 + 2] = this.params.widthCircle * Math.sin(i * 0.013)

      randomPosition[i3] = this.getRandomWithPower()
      randomPosition[i3 + 1] = this.getRandomWithPower()
      randomPosition[i3 + 2] = this.getRandomWithPower()

      randomSize[i] = Math.max(Math.random() * 2, 0.3)

      elevation[i] = i * 0.0015

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
    this.mesh.position.y += 0.5
    this.scene.add(this.mesh)

    this.initGUI()
  }

  initGUI() {
    const folder = this.gui.addFolder(`Particules ${Math.random()}`)
    folder.closed = false

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

  getRandomWithPower(power = this.params.powerRandom, radius = this.params.radiusRandom) {
    // eslint-disable-next-line no-restricted-properties
    const r = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * power * radius
    return r
  }

  update(t) {
    this.mesh.material.uniforms.uTime.value = t * this.speed * this.senseRotation
    this.mesh.rotation.y = t * 0.5
  }
}

export default ParticularWind
