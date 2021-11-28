import * as THREE from 'three'
// eslint-disable-next-line import/extensions
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import ParticularWind from './partcularWind'
import MirrorIsland from './MirrorIsland'

class App {
  constructor() {
    // Debug
    this.gui = new dat.GUI({ width: 340 })
    this.debug = window.location.hash === '#DEBUG'

    // Canvas
    this.canvas = document.querySelector('canvas.webgl')

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.resize()

    this.initMirrorIsland()

    this.clock = new THREE.Clock()
    this.initEvents()
  }

  //
  // Init World
  //
  initScene() {
    this.scene = new THREE.Scene()
  }

  initCamera() {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.set(0, 2.77, 0)
    this.scene.add(this.camera)
    // this.scene.background = new THREE.Color(0xff0000)

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  //
  // INIT MAP
  //
  initMirrorIsland() {
    this.mirrorIsland = new MirrorIsland({
      scene: this.scene,
      renderer: this.renderer,
      gui: this.gui,
    })
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

    this.mirrorIsland.update(elapsedTime)

    // Render
    this.renderer.render(this.scene, this.camera)
  }
}

export default App
