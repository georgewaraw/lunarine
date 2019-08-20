import * as THREE from 'three'
import helper from 'helper'

const mat = {

  sphereLeft: null,
  sphereRight: null,
  cylinder: null,
  octahedron: null,
  points: null,
  text: null

}

const color = helper.color( 'light' )

mat.sphereLeft = new THREE.MeshLambertMaterial( {

  transparent: true,
  opacity: .25,
  vertexColors: THREE.FaceColors

} )

mat.sphereRight = mat.sphereLeft.clone()

mat.cylinder = new THREE.MeshLambertMaterial( {

  depthWrite: false,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: .25,
  color: color

} )

mat.octahedron = new THREE.MeshLambertMaterial( {

  transparent: true,
  opacity: .75,
  color: color

} )

mat.points = new THREE.PointsMaterial( {

  depthWrite: false,
  size: .01,
  transparent: true,
  opacity: .25,
  color: helper.color()

} )

mat.text = new THREE.MeshLambertMaterial( {

  transparent: true,
  opacity: .75,
  color: helper.color( 'dark' )

} )

export default mat
