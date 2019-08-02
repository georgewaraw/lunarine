import * as THREE from 'three'
import app from 'app'

const ambient = new THREE.AmbientLight( app.color, .5 )
app.scene.add( ambient )

const point = new THREE.PointLight( app.color, .5, 100 )
point.shadow.mapSize = new THREE.Vector2( 512, 512 )
point.castShadow = true
point.position.set( 5, 15, 10 )
app.scene.add( point )
