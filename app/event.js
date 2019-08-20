import * as THREE from 'three'
import TWEEN from 'es6-tween'
import app from 'app'
import Audio from 'Audio'
import helper from 'helper'
import mat from 'mat'
import mesh from 'mesh'
import shader from 'shader'

window.onresize = () => {

  app.renderer.setSize( window.innerWidth, window.innerHeight )

  app.camera.aspect = window.innerWidth / window.innerHeight
  app.camera.updateProjectionMatrix()

  app.post.setSize( window.innerWidth, window.innerHeight )

  app.composer.reset()

}

window.onorientationchange = () => location.reload()

window.ontouchforcechange = event => {

  if ( event.changedTouches[ 0 ].force >= .5 ) location.reload()

}

document.getElementsByTagName( 'canvas' )[ 0 ].ontouchstart = event => event.preventDefault()

let moving

const move = direction => {

  if ( moving !== direction ) {

    if ( direction === 'left' && app.camera.position.x >= 0 ) {

      new TWEEN.Tween( app.camera.position )
        .to( { x: -1.5 }, 250 )
        .easing( TWEEN.Easing.Quadratic.Out )
        .on( 'complete', () => moving = direction )
        .start()

    } else if ( direction === 'right' && app.camera.position.x <= 0 ) {

      new TWEEN.Tween( app.camera.position )
        .to( { x: 1.5 }, 250 )
        .easing( TWEEN.Easing.Quadratic.Out )
        .on( 'complete', () => moving = direction )
        .start()

    }

  }

}

const moveLeft = new TWEEN.Tween( mesh.octahedron.position )
  .to( { x: -1.5 }, 500 )
  .easing( TWEEN.Easing.Quadratic.In )

const moveRight = new TWEEN.Tween( mesh.octahedron.position )
  .to( { x: 1.5 }, 500 )
  .easing( TWEEN.Easing.Quadratic.In )

function act() {

  switch ( app.state ) {

    case 'start':

      if ( moving === 'left' ) move( 'right' )
      else move( 'left' )
      break

    case 'stop':

      location.reload()
      break

    default:

      app.state = 'start'

      app.audio = new Audio()

      mat.sphereLeft.opacity = 1
      mat.sphereRight.opacity = 1
      mat.cylinder.opacity = .75

      app.scene.remove( mesh.text )
      app.scene.add( mesh.octahedron )

      new TWEEN.Tween( mesh.octahedron.position )
        .to( { y: [ 12, 13, 12.5 ] }, 10000 )
        .repeat( Infinity )
        .start()

      setInterval( () => {

        if ( helper.random( 0, 2 ) ) {

          if ( mesh.octahedron.position.x === 1.5 ) moveLeft.start()
          else if ( mesh.octahedron.position.x === -1.5 ) moveRight.start()

        }

      }, 1000 )

      move( 'right' )

  }

}

window.onkeydown = () => act()

window.onmousedown = () => act()

window.ontouchend = () => act()

app.stop = () => {

  app.state = 'stop'

  app.camera.position.x = 0

  app.post.shader.uniforms.uIntensity.value = .75

  mat.sphereLeft.opacity = .25
  mat.sphereRight.opacity = .25
  mat.cylinder.opacity = .25

  shader.cylinder.uniforms.uDistort.value = .75

  app.scene.remove( mesh.octahedron )

  new THREE.FontLoader().load( 'static/VT323_Regular.json', font => {

    const text = new THREE.Mesh( new THREE.TextBufferGeometry(
      `SCORE\n${ ( `00000` + Math.round( app.score ) ).slice( -5 ) }`, {

        font: font,
        size: .1,
        height: .01

      } ), mat.text )
    text.position.set( -.1375, 10.1, 6.25 )
    app.scene.add( text )

  } )

}
