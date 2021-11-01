/* eslint-disable import/extensions */
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

const OPTIONS = {
  distortionScale: 1.3,
  size: 2.5,
}

class ReflactorPlane {
  constructor({ scene, gui, options = OPTIONS }) {
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000)

    this.water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x032d29,
        distortionScale: options.distortionScale,
        fog: scene.fog !== undefined,
      },
    )
    this.water.material.uniforms.size.value = options.size

    this.water.rotation.x = -Math.PI / 2

    scene.add(this.water)

    // GUI
    const waterUniforms = this.water.material.uniforms

    const folderWater = gui.addFolder('Water')
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale')
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size')
    folderWater.open()
  }

  update(t) {
    this.water.material.uniforms.time.value = t * 0.1
  }
}

export default ReflactorPlane
