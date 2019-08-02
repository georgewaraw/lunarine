import TWEEN from 'es6-tween'
import app from 'app'

window.onresize = () => {

  app.renderer.setPixelRatio( .2 )
  app.renderer.setSize( window.innerWidth, window.innerHeight )

  app.camera.aspect = window.innerWidth / window.innerHeight
  app.camera.updateProjectionMatrix()

  app.post.setSize( window.innerWidth, window.innerHeight )

  app.composer.reset()

}

window.onorientationchange = () => location.reload()

window.ontouchforcechange = event => {

  if ( event.changedTouches[0].force >= .5 ) location.reload()

}

let moving = false

const moveLeft = new TWEEN.Tween( app.camera.position )
  .to( { x: -1.5 }, 250 )
  .easing( TWEEN.Easing.Quadratic.Out )
  .on( 'complete', () => moving = false )

const moveRight = new TWEEN.Tween( app.camera.position )
  .to( { x: 1.5 }, 250 )
  .easing( TWEEN.Easing.Quadratic.Out )
  .on( 'complete', () => moving = false )

const move = d => {

  if ( !moving ) {

    if ( d === 'left' && app.camera.position.x >= 0 ) {

      moving = true

      moveLeft.start()

    }
    else if ( d === 'right' && app.camera.position.x <= 0 ) {

      moving = true

      moveRight.start()

    }

  }

}

window.onkeydown = e => {

  switch ( app.state ) {

    case 'start':

      switch ( e.code ) {

        case 'ArrowLeft':

        case 'KeyA':

          move( 'left' )
          break

        case 'ArrowRight':

        case 'KeyD':

          move( 'right' )
          break

      }
      break

    case 'stop':

      location.reload()
      break

    default:

      app.start()

  }

}

let startX, startY

window.ontouchstart = e => {

  startX = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1
  startY = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1

}

window.ontouchend = e => {

  const endX = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1
  const endY = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1

  switch ( app.state ) {

    case 'start':

      if ( Math.abs( startY - endY ) < .25 && startX - endX < -.25 ) move( 'left' )
      else if ( Math.abs( startY - endY ) < .25 && startX - endX > .25 ) move( 'right' )
      break

    case 'stop':

      location.reload()
      break

    default:

      app.start()

  }

}

document.getElementsByTagName( 'canvas' )[ 0 ].ontouchstart = e => e.preventDefault()
