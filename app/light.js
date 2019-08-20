import * as THREE from 'three'
import app from 'app'

app.scene.add( new THREE.AmbientLight( app.color, .5 ) )

const light = new THREE.PointLight( app.color, .5, 100 )
light.shadow.mapSize = new THREE.Vector2( 512, 512 )
light.castShadow = true
light.position.set( 5, 15, 10 )
app.scene.add( light )
