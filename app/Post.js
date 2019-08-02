import * as THREE from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'

export default function Post() {

	Pass.call( this )

	this.textureComp = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {

		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat

	} )

	this.textureOld = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {

		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat

	} )

	this.shader = new THREE.ShaderMaterial( {

		uniforms: {

			tOld: { value: null },
			tNew: { value: null },
			uIntensity: { value: .75 },
			uTime: { value: 0 }

		},
		vertexShader: `

			varying vec2 vUv;

      void main() {

        vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );

      }

		`,
		fragmentShader: `

			uniform sampler2D tOld;
      uniform sampler2D tNew;
      uniform float uIntensity;
      uniform float uTime;

      varying vec2 vUv;

      void main() {

				vec4 afterimage = max( texture2D( tNew, vUv ),
					texture2D( tOld, vUv ) * max( sign( texture2D( tOld, vUv ) - .1 ), .0 ) * uIntensity );
				vec4 noise = afterimage * .95 +
					fract( sin( dot( vUv * ( sin( uTime ) + 10. ), vec2( 12.9898, 78.233 ) ) ) * 43758.5453123 ) * .05;
        gl_FragColor = vec4( noise.r, ( noise.g + noise.b ) * .5, ( noise.g + noise.b ) * .5, 1. );

      }

		`

	} )

	this.compFsQuad = new Pass.FullScreenQuad( this.shader )

	this.copyFsQuad = new Pass.FullScreenQuad( new THREE.MeshBasicMaterial() )

}

Post.prototype = Object.assign( Object.create( Pass.prototype ), {

	constructor: Post,

	render: function ( renderer, writeBuffer, readBuffer ) {

		this.shader.uniforms.tOld.value = this.textureOld.texture
		this.shader.uniforms.tNew.value = readBuffer.texture

		renderer.setRenderTarget( this.textureComp )
		this.compFsQuad.render( renderer )

		this.copyFsQuad.material.map = this.textureComp.texture

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null )
			this.copyFsQuad.render( renderer )

		} else {

			renderer.setRenderTarget( writeBuffer )

			if ( this.clear ) renderer.clear()

			this.copyFsQuad.render( renderer )

		}

		const temp = this.textureOld
		this.textureOld = this.textureComp
		this.textureComp = temp

	},

	setSize: function ( width, height ) {

		this.textureComp.setSize( width, height )
		this.textureOld.setSize( width, height )

	}

} )

// based on AfterimagePass and AfterimageShader by HypnosNova, FilmShader by alteredq, TechnicolorShader by flimshaw
