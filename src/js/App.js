import * as THREE from 'three'
// eslint-disable-next-line import/extensions
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import ParticularWind from './partcularWind'
import Ocean from './Ocean'
import Island from './Island'
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

    // this.initAxis()
    this.initParticules()
    this.initWater()
    // this.initIsland()
    this.initMirrorIsland()

    this.clock = new THREE.Clock()
    this.initEvents()
  }

  //
  // Init World
  //
  initScene() {
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog('black', 0.1, 60)
  }

  initCamera() {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.set(2.9, 2, 2.9)
    this.scene.add(this.camera)

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)
    if (this.debug) return
    this.controls.maxPolarAngle = Math.PI * 0.495
    this.controls.minPolarAngle = Math.PI * 0.1
    this.controls.target.set(0, 0, 0)
    this.controls.minDistance = 3
    this.controls.maxDistance = 10
    this.controls.enablePan = false
    this.controls.enableDamping = true
    this.controls.update()
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  initAxis() {
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }

  //
  // INIT MAP
  //
  initParticules() {
    this.particules = new ParticularWind({
      scene: this.scene,
      renderer: this.renderer,
      gui: this.gui,
    })
  }

  initWater() {
    this.water = new Ocean({
      scene: this.scene,
      renderer: this.renderer,
      gui: this.gui,
    })
  }

  initIsland() {
    this.island = new Island({
      scene: this.scene,
    })
  }

  initMirrorIsland() {
    this.mirrorIsland = new MirrorIsland({
      scene: this.scene,
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

    this.particules.update(elapsedTime)
    this.water.update(elapsedTime)

    // Render
    this.renderer.render(this.scene, this.camera)
  }
}

export default App
