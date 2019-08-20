import TWEEN from 'es6-tween'
import app from 'app'
import helper from 'helper'
import mesh from 'mesh'
import shader from 'shader'

app.renderer.setAnimationLoop( time => {

  time /= 1000

  TWEEN.update()

  mesh.points.position.set( app.camera.position.x - .5, app.camera.position.y - .5, 6.5 )

  if ( app.state === 'start' ) {

    mesh.sphereLeft.rotation.x = time / 2
    mesh.sphereRight.rotation.x = time / 2
    mesh.cylinder.rotation.x = time / 2
    mesh.octahedron.rotation.y = time / 2

    const amplitude = helper.map( app.audio.analyser.getAverageFrequency(), 63, 255, .1, 3 )

    if ( mesh.octahedron.position.x === -1.5 ) {

      if ( shader.sphereLeft ) shader.sphereLeft.uniforms.uDistort.value = amplitude * 2

      if ( app.camera.position.x === -1.5 && shader.sphereLeft.uniforms.uDistort.value > .2 ) {

        if ( app.post.shader.uniforms.uIntensity.value < 1 ) {

          app.post.shader.uniforms.uIntensity.value += .005

          app.score += .5

        } else app.stop()

      } else if ( app.camera.position.x === 1.5 ) {

        if ( app.post.shader.uniforms.uIntensity.value > .75 ) app.post.shader.uniforms.uIntensity.value -= .005
        else app.post.shader.uniforms.uIntensity.value = .75

      }

    } else if ( mesh.octahedron.position.x === 1.5 ) {

      if ( shader.sphereRight ) shader.sphereRight.uniforms.uDistort.value = amplitude * 2

      if ( app.camera.position.x === 1.5 && shader.sphereRight.uniforms.uDistort.value > .2 ) {

        if ( app.post.shader.uniforms.uIntensity.value < 1 ) {

          app.post.shader.uniforms.uIntensity.value += .005

          app.score += .5

        } else app.stop()

      } else if ( app.camera.position.x === -1.5 ) {

        if ( app.post.shader.uniforms.uIntensity.value > .75 ) app.post.shader.uniforms.uIntensity.value -= .005
        else app.post.shader.uniforms.uIntensity.value = .75

      }

    } else {

      if ( shader.sphereLeft && shader.sphereLeft.uniforms.uDistort.value > .1 )
        shader.sphereLeft.uniforms.uDistort.value = .1
      if ( shader.sphereRight && shader.sphereRight.uniforms.uDistort.value > .1 )
        shader.sphereRight.uniforms.uDistort.value = .1

    }

    if ( shader.cylinder ) shader.cylinder.uniforms.uDistort.value = amplitude
    if ( shader.octahedron ) shader.octahedron.uniforms.uDistort.value = amplitude * 1.25
    if ( shader.points ) shader.points.uniforms.uDistort.value = amplitude

  }

  if ( shader.sphereLeft ) shader.sphereLeft.uniforms.uTime.value = time
  if ( shader.sphereRight ) shader.sphereRight.uniforms.uTime.value = time
  if ( shader.cylinder ) shader.cylinder.uniforms.uTime.value = time
  if ( shader.octahedron ) shader.octahedron.uniforms.uTime.value = time
  if ( shader.points ) shader.points.uniforms.uTime.value = time
  if ( shader.text ) shader.text.uniforms.uTime.value = time

  app.post.shader.uniforms.uTime.value = time

  app.composer.render()

} )
