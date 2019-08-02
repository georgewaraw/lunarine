import * as THREE from 'three'
import helper from 'helper'

const geo = { sphereLeft: null, sphereRight: null, cylinder: null, octahedron: null, points: null }

const colorDark = new THREE.Color( helper.color( 'dark' ) )
const colorLight = new THREE.Color( helper.color( 'light' ) )

geo.sphereLeft = new THREE.SphereGeometry( 10, 24, 24 )
geo.sphereLeft.vertices.forEach( vertex => vertex.y = Math.max( vertex.y, 0 ) )
geo.sphereLeft.faces.forEach( ( face, index ) => face.color = index % 2 ? colorDark : colorLight )

geo.sphereRight = new THREE.SphereGeometry( 10, 24, 24 )
geo.sphereRight.vertices.forEach( vertex => vertex.y = Math.min( vertex.y, 0 ) )
geo.sphereRight.faces.forEach( ( face, index ) => face.color = index % 2 ? colorDark : colorLight )

geo.cylinder = new THREE.Geometry()
geo.sphereLeft.faces.forEach( ( face, index ) => {

  if ( !( index % 20 ) ) {

    const geometry = new THREE.CylinderGeometry( 0, .25, 5 )
    geometry.rotateX( 90 * Math.PI / 180 )
    geometry.lookAt( face.normal )
    geometry.translate( face.normal.x * 10, face.normal.y * 10, face.normal.z * 10 )
    geo.cylinder.merge( geometry )

  }

} )

geo.octahedron = new THREE.OctahedronBufferGeometry( 1 )

const points = []
for ( let index = 1000; index--; ) points.push( new THREE.Vector3( Math.random(), Math.random(), Math.random() ) )
geo.points = new THREE.BufferGeometry().setFromPoints( points )

export default geo
