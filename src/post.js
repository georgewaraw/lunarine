THREE.Post = function() {

  THREE.Pass.call(this);

  this.textureComp = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat
  });

  this.textureOld = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat
  });

  this.shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tOld: {
        value: null,
      },
      tNew: {
        value: null,
      },
      uTime: {
        value: 0,
      },
    },
    vertexShader: `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }
    `,
    fragmentShader: `
      uniform sampler2D tOld;
      uniform sampler2D tNew;
      uniform float uTime;
  
      varying vec2 vUv;
  
      void main() {
        vec4 a = max(texture2D(tNew, vUv), texture2D(tOld, vUv) * max(sign(texture2D(tOld, vUv) - .1), .0) * .6);
        vec4 b = a * .95 + fract(sin(dot(vUv * (sin(uTime) + 10.), vec2(12.9898, 78.233))) * 43758.5453123) * .05; 
        vec4 c = vec4(b.r, (b.g + b.b) * .5, (b.g + b.b) * .5, 1.);
        gl_FragColor = c;
      }
    `,
  });

  this.compFsQuad = new THREE.Pass.FullScreenQuad(this.shaderMaterial);

  var material = new THREE.MeshBasicMaterial();
  this.copyFsQuad = new THREE.Pass.FullScreenQuad(material);

};

THREE.Post.prototype = Object.assign(Object.create(THREE.Pass.prototype), {
  constructor: THREE.Post,
  render: function(renderer, writeBuffer, readBuffer) {
    this.shaderMaterial.uniforms.tOld.value = this.textureOld.texture;
    this.shaderMaterial.uniforms.tNew.value = readBuffer.texture;

    renderer.setRenderTarget(this.textureComp);
    this.compFsQuad.render(renderer);

    this.copyFsQuad.material.map = this.textureComp.texture;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.copyFsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);

      if (this.clear) renderer.clear();

      this.copyFsQuad.render(renderer);
    }

    var temp = this.textureOld;
    this.textureOld = this.textureComp;
    this.textureComp = temp;
  },
  setSize: function(width, height) {
    this.textureComp.setSize(width, height);
    this.textureOld.setSize(width, height);
  }
});