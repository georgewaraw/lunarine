import * as THREE from 'three'
import geo from 'geo'
import mat from 'mat'
import app from 'app'

const mesh = { sphereLeft: null, sphereRight: null, cylinder: null, octahedron: null, points: null }

mesh.sphereLeft = new THREE.Mesh( geo.sphereLeft, mat.sphereLeft )
mesh.sphereLeft.receiveShadow = true
mesh.sphereLeft.rotation.set( 0, 0, 90 * Math.PI / 180 )
app.scene.add( mesh.sphereLeft )

mesh.sphereRight = new THREE.Mesh( geo.sphereRight, mat.sphereRight )
mesh.sphereRight.receiveShadow = true
mesh.sphereRight.rotation.set( 0, 0, 90 * Math.PI / 180 )
app.scene.add( mesh.sphereRight )

mesh.cylinder = new THREE.Mesh( geo.cylinder, mat.cylinder )
mesh.cylinder.castShadow = true
app.scene.add( mesh.cylinder )

mesh.octahedron = new THREE.Mesh( geo.octahedron, mat.octahedron )
mesh.octahedron.position.set( -1.5, 12.5, -12.5 )

mesh.points = new THREE.Points( geo.points, mat.points )
app.scene.add( mesh.points )

new THREE.FontLoader().load( 'static/VT323_Regular.json', f => {

  mesh.text = new THREE.Mesh( new THREE.TextBufferGeometry( ' waraws\nLUNARINE', { font: f, size: .1, height: .01 } )
    , mat.text )
  mesh.text.position.set( -.225, 10.1, 6.25 )
  app.scene.add( mesh.text )

} )

export default mesh
