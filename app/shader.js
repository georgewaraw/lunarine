import mat from 'mat'

const shader = { sphereLeft: null, sphereRight: null, cylinder: null, octahedron: null, points: null, text: null }

const uniforms = `

  uniform float uTime;
  uniform float uMorph;
  uniform float uDistort;

`
const vertexShader = `

  vec3 transformed = position;

  transformed.x += sin( ( position.x + uTime * .375 ) * 20. ) * .0015 * uMorph;
  transformed.y += sin( ( position.y + uTime * .375 ) * 20. ) * .0015 * uMorph;
  transformed.z += sin( ( position.z + uTime * .375 ) * 20. ) * .0015 * uMorph;

  if ( uDistort > 0. ) {

    transformed.x += fract( sin( dot( position.x + uTime * .00000025, ( 12.9898, 78.233 ) ) ) * 43758.5453123 )
      * uDistort;
    transformed.y += fract( sin( dot( position.x + uTime * .00000025, ( 12.9898, 78.233 ) ) ) * 43758.5453123 )
      * uDistort;
    transformed.z += fract( sin( dot( position.x + uTime * .00000025, ( 12.9898, 78.233 ) ) ) * 43758.5453123 )
      * uDistort;

  }

`

mat.sphereLeft.onBeforeCompile = program => {

  program.uniforms.uTime = { value: 0 }
  program.uniforms.uMorph = { value: 10 }
  program.uniforms.uDistort = { value: .1 }

  program.vertexShader = uniforms + program.vertexShader
  program.vertexShader = program.vertexShader.replace( '#include <begin_vertex>',
    vertexShader.substring( 0, vertexShader.indexOf( ';' ) + 1 ) + `

      transformed.y *= 2.;

    ` + vertexShader.substring( vertexShader.indexOf( ';' ) + 1 ) )

  shader.sphereLeft = program

}

mat.sphereRight.onBeforeCompile = program => {

  program.uniforms.uTime = { value: 0 }
  program.uniforms.uMorph = { value: 10 }
  program.uniforms.uDistort = { value: .1 }

  program.vertexShader = uniforms + program.vertexShader
  program.vertexShader = program.vertexShader.replace( '#include <begin_vertex>',
    vertexShader.substring( 0, vertexShader.indexOf( ';' ) + 1 ) + `

      transformed.y *= 2.;

    ` + vertexShader.substring( vertexShader.indexOf( ';' ) + 1 ) )

  shader.sphereRight = program

}

mat.cylinder.onBeforeCompile = program => {

  program.uniforms.uTime = { value: 0 }
  program.uniforms.uMorph = { value: 10 }
  program.uniforms.uDistort = { value: .75 }

  program.vertexShader = uniforms + program.vertexShader
  program.vertexShader = program.vertexShader.replace( '#include <begin_vertex>', vertexShader )

  shader.cylinder = program

}

mat.octahedron.onBeforeCompile = program => {

  program.uniforms.uTime = { value: 0 }
  program.uniforms.uMorph = { value: 20 }
  program.uniforms.uDistort = { value: .1 }

  program.vertexShader = uniforms + program.vertexShader
  program.vertexShader = program.vertexShader.replace( '#include <begin_vertex>',
    vertexShader.substring( 0, vertexShader.indexOf( ';' ) + 1 ) + `

      transformed.x *= .75;
      transformed.y *= 1.5;
      transformed.z *= .75;

    ` + vertexShader.substring( vertexShader.indexOf( ';' ) + 1 ) )

  shader.octahedron = program

}

mat.points.onBeforeCompile = program => {

  program.uniforms.uTime = { value: 0 }
  program.uniforms.uMorph = { value: 10 }
  program.uniforms.uDistort = { value: .75 }

  program.vertexShader = uniforms + program.vertexShader
  program.vertexShader = program.vertexShader.replace( '#include <begin_vertex>', vertexShader )

  shader.points = program

}

mat.text.onBeforeCompile = program => {

  program.uniforms.uTime = { value: 0 }
  program.uniforms.uMorph = { value: .75 }
  program.uniforms.uDistort = { value: .001 }

  program.vertexShader = uniforms + program.vertexShader
  program.vertexShader = program.vertexShader.replace( '#include <begin_vertex>', vertexShader )

  shader.text = program

}

export default shader
