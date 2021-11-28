/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
//
// Initial code : https://github.com/mrdoob/three.js/blob/master/examples/js/objects/Reflector.js
//

import * as THREE from 'three'

class Reflector extends THREE.Mesh {
  constructor(geometry, options = {}, sceneRender) {
    super(geometry)
    this.type = 'Reflector'
    const scope = this
    const color = options.color !== undefined ? new THREE.Color(options.color) : new THREE.Color(0x7F7F7F)
    const textureWidth = options.textureWidth || 512
    const textureHeight = options.textureHeight || 512
    const shader = options.shader || Reflector.ReflectorShader //

    const textureMatrix = new THREE.Matrix4()
    const virtualCamera = new THREE.PerspectiveCamera()

    // add params to camera
    virtualCamera.position.set(0, -8, 0)
    virtualCamera.rotateX(Math.PI / 2)

    const parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
    }
    const renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight, parameters)

    if (!THREE.MathUtils.isPowerOfTwo(textureWidth) || !THREE.MathUtils.isPowerOfTwo(textureHeight)) {
      renderTarget.texture.generateMipmaps = false
    }

    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(shader.uniforms),
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
    })
    material.uniforms.tDiffuse.value = renderTarget.texture
    material.uniforms.color.value = color
    material.uniforms.textureMatrix.value = textureMatrix
    this.material = material

    this.onBeforeRender = function (renderer, scene, camera) {
      textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0)
      textureMatrix.multiply(virtualCamera.projectionMatrix)
      textureMatrix.multiply(virtualCamera.matrixWorldInverse)
      textureMatrix.multiply(scope.matrixWorld) // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
      // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf

      renderTarget.texture.encoding = renderer.outputEncoding
      scope.visible = false
      const currentRenderTarget = renderer.getRenderTarget()
      const currentXrEnabled = renderer.xr.enabled
      const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate
      renderer.xr.enabled = false // Avoid camera modification

      renderer.shadowMap.autoUpdate = false // Avoid re-computing shadows

      renderer.setRenderTarget(renderTarget)
      renderer.state.buffers.depth.setMask(true) // make sure the depth buffer is writable so it can be properly cleared, see #18897

      if (renderer.autoClear === false) renderer.clear()
      renderer.render(sceneRender, virtualCamera)
      renderer.xr.enabled = currentXrEnabled
      renderer.shadowMap.autoUpdate = currentShadowAutoUpdate
      renderer.setRenderTarget(currentRenderTarget) // Restore viewport

      const { viewport } = camera

      if (viewport !== undefined) {
        renderer.state.viewport(viewport)
      }

      scope.visible = true
    }

    this.getRenderTarget = function () {
      return renderTarget
    }
  }
}
export default Reflector
