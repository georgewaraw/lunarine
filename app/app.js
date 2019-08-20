import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import helper from 'helper'
import Post from 'Post'

const app = {

  color: null,
  renderer: null,
  scene: null,
  camera: null,
  post: null,
  composer: null,
  score: null,
  state: null,
  audio: null,
  stop: null

}

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

app.post = new Post()

app.composer = new EffectComposer( app.renderer )
app.composer.addPass( new RenderPass( app.scene, app.camera ) )
app.composer.addPass( app.post )

app.score = 0

export default app
