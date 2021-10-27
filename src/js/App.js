import * as THREE from 'three'
// eslint-disable-next-line import/extensions
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

class App {
  constructor() {
    // Debug
    this.gui = new dat.GUI({ width: 340 })

    // Canvas
    this.canvas = document.querySelector('canvas.webgl')

    // Scene
    this.scene = new THREE.Scene()

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.initCamera()
    this.initRenderer()
    this.resize()

    this.clock = new THREE.Clock()
    this.initEvents()
  }

  initCamera() {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.set(3, 4, 3)
    this.scene.add(this.camera)

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  //
  // Events
  //
  initEvents() {
    window.addEventListener('resize', this.resize.bind(this))

    this.update()
  }

  resize() {
    // Update sizes
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  //
  // Update
  //
  update() {
    window.requestAnimationFrame(this.update.bind(this))

    const elapsedTime = this.clock.getElapsedTime()

    // Update controls
    this.controls.update()

    // Render
    this.renderer.render(this.scene, this.camera)
  }
}

export default App
