import * as THREE from 'three'
import app from 'app'

export default function () {

  const listener = new THREE.AudioListener()
  app.camera.add( listener )

  const audio = new THREE.Audio( listener )

  new THREE.AudioLoader().load( 'static/audio.mp3', buffer => {

    audio.setBuffer( buffer )
    audio.setLoop( true )
    audio.play()

  } )

  this.analyser = new THREE.AudioAnalyser( audio )

  window.onblur = () => audio.setVolume( 0 )
  window.onfocus = () => audio.setVolume( 1 )

}
