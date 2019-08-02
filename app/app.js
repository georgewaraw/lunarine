import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import TWEEN from 'es6-tween'
import helper from 'helper'
import Post from 'Post'
import Audio from 'Audio'
import mat from 'mat'
import mesh from 'mesh'
import shader from 'shader'

const app = { color: null, renderer: null, scene: null, camera: null, composer: null, post: null, score: null,
  start: null, state: null, audio: null, stop: null }

app.color = helper.color( 'light' )

app.renderer = new THREE.WebGLRenderer( { canvas: document.getElementsByTagName( 'canvas' )[ 0 ] } )
app.renderer.setPixelRatio( .2 )
app.renderer.setSize( window.innerWidth, window.innerHeight )
app.renderer.setClearColor( app.color )
app.renderer.shadowMap.enabled = true

app.scene = new THREE.Scene()
app.scene.fog = new THREE.FogExp2( app.color, .075 )

app.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 1000 )
app.camera.position.set( 0, 10, 7.5 )

app.composer = new EffectComposer( app.renderer )
app.composer.addPass( new RenderPass( app.scene, app.camera ) )

app.post = new Post()
app.composer.addPass( app.post )

app.score = 0

app.start = () => {

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

  const moveLeft = new TWEEN.Tween( mesh.octahedron.position )
    .to( { x: -1.5 }, 500 )
    .easing( TWEEN.Easing.Quadratic.In )

  const moveRight = new TWEEN.Tween( mesh.octahedron.position )
    .to( { x: 1.5 }, 500 )
    .easing( TWEEN.Easing.Quadratic.In )

  setInterval( () => {

    if ( helper.random( 0, 2 ) ) {

      if ( mesh.octahedron.position.x === 1.5 ) moveLeft.start()
      else if ( mesh.octahedron.position.x === -1.5 ) moveRight.start()

    }

  }, 1000 )

}

app.stop = () => {

  app.state = 'stop'

  app.camera.position.x = 0

  app.post.shader.uniforms.uIntensity.value = .75

  mat.sphereLeft.opacity = .25
  mat.sphereRight.opacity = .25
  mat.cylinder.opacity = .25

  shader.cylinder.uniforms.uDistort.value = .75

  app.scene.remove( mesh.octahedron )

  new THREE.FontLoader().load( 'static/VT323_Regular.json', f => {

    const text = new THREE.Mesh( new THREE.TextBufferGeometry(
      `SCORE\n${ ( `00000` + Math.round( app.score ) ).slice( -5 ) }`, { font: f, size: .1, height: .01 } ), mat.text )
    text.position.set( -.1375, 10.1, 6.25 )
    app.scene.add( text )

  } )

}

export default app
