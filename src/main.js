let app, light, object, input;

const getInt = (l, h) => Math.floor(Math.random() * (h - l) + l);

const getColor = b => {
  let l = 10;

  switch (b) {
    case 'bright':
      l *= 2;
    case 'normal':
      l *= 2;
    case 'dark':
      l *= 2;
  }

  return `hsl(${getInt(0, 360)}, ${getInt(0, 101)}%, ${l}%)`;
};

function init() {
  app = {
    renderer: null,
    camera: null,
    scene: null,
    composer: null,
    pass: null,
    time: null,
  };

  app.renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByTagName('canvas')[0],
  });
  app.renderer.setPixelRatio(.2);
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  app.renderer.setClearColor(getColor('bright'));
  app.renderer.shadowMap.enabled = true;

  app.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  app.camera.position.set(0, 10, 7.5);

  app.scene = new THREE.Scene();
  app.scene.add(app.camera);

  level();
  post();
  inter();
  anim();
}

function level() {
  light = {
    ambient: null,
    point: null,
  };

  const cl = getColor('bright');

  light.ambient = new THREE.AmbientLight(cl, .5);
  app.scene.add(light.ambient);

  light.point = new THREE.PointLight(cl, .5, 100);
  light.point.position.set(5, 5, 5);
  light.point.castShadow = true;
  light.point.shadow.mapSize = new THREE.Vector2(512, 512);
  app.camera.add(light.point);


  object = {
    material: null,
    geometry: null,
    mesh: null,
  };

  object.material = [
    new THREE.MeshLambertMaterial({
      depthWrite: false,
      transparent: true,
      opacity: .75,
    }),
    new THREE.MeshLambertMaterial({
      color: getColor('dark'),
    }),
    new THREE.MeshLambertMaterial({
      color: getColor('bright'),
    }),
  ];

  object.geometry = new THREE.Geometry();
  object.geometry.merge(new THREE.SphereGeometry(10, 24, 24));

  object.geometry.faces.forEach((f, i) => {
    f.materialIndex = (i % 2) === 0 ? 1 : 2;

    let g = new THREE.SphereGeometry(1, 2, 2);
    g.lookAt(f.normal);
    g.translate(f.normal.x * 20, f.normal.y * 20, f.normal.z * 20);
    object.geometry.merge(g);

    if (!getInt(0, 5)) {
      let g = new THREE.PlaneGeometry(2, 1);
      g.rotateY(270 * Math.PI / 180);
      g.lookAt(f.normal);
      g.translate(f.normal.x * 11.125, f.normal.y * 11.125, f.normal.z * 11.125);
      object.geometry.merge(g);
    }
  });
  object.geometry.faces.forEach(f => {
    if (!f.materialIndex) f.materialIndex = 0;
  });

  object.mesh = new THREE.Mesh(object.geometry, object.material);
  object.mesh.rotation.set(0, 0, 90 * Math.PI / 180);
  app.scene.add(object.mesh);


  // const uniforms = `
  //   uniform float uTime;
  //   uniform float uMorph;
  //   uniform float uDistort;
  // `;
  // const shaderVertex = `
  //   vec3 transformed = vec3(position);
  //
  //   transformed.x += sin((position.x + uTime * .375) * 20.) * .0015 * uMorph;
  //   transformed.y += sin((position.y + uTime * .375) * 20.) * .0015 * uMorph;
  //   transformed.z += sin((position.z + uTime * .375) * 20.) * .0015 * uMorph;
  //
  //   if (uDistort > 0.) {
  //     transformed.x += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
  //     transformed.y += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
  //     transformed.z += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
  //   }
  // `;
  //
  //
  // object = {
  //   geometry: null,
  //   material: null,
  //   shader: null,
  //   mesh: null,
  // };
  //
  // object.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  //
  // object.material = new THREE.MeshPhongMaterial({
  //   color: getColor('dark'),
  // });
  // object.material.onBeforeCompile = (s) => {
  //   object.shader = s;
  //
  //   s.uniforms.uTime = {
  //     value: 0,
  //   };
  //   s.uniforms.uMorph = {
  //     value: 2,
  //   };
  //   s.uniforms.uDistort = {
  //     value: 0,
  //   };
  //
  //   s.vertexShader = uniforms + s.vertexShader;
  //   s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', shaderVertex);
  // };
  //
  // object.mesh = new THREE.Mesh(object.geometry, object.material);
  // object.mesh.position.set(app.camera.position.x, app.camera.position.y, app.camera.position.z - 4);
  // object.mesh.rotation.set(45 * Math.PI / 180, 45 * Math.PI / 180, 0);
  // object.mesh.castShadow = true;
  // app.scene.add(object.mesh);
  //
  //
  // const m = new THREE.Mesh(
  //   new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshPhongMaterial({color: getColor('bright')}));
  // app.scene.add(m);
  // m.position.set(app.camera.position.x, app.camera.position.y, app.camera.position.z - 6);
  // m.receiveShadow = true;
}

function post() {
  app.composer = new THREE.EffectComposer(app.renderer);
  app.composer.addPass(new THREE.RenderPass(app.scene, app.camera));
  app.composer.addPass(app.pass = new THREE.Post());
  app.pass.renderToScreen = true;
}

function inter() {
  window.onorientationchange = () => location.reload();

  window.onresize = () => {
    app.renderer.setSize(window.innerWidth, window.innerHeight);

    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();

    app.pass.setSize(window.innerWidth, window.innerHeight);
    app.composer.reset();
  };


  input = {
    touch: {
      start: {
        x: null,
        y: null,
      },
      end: {
        x: null,
        y: null,
      },
    },
    isEnabled: null,
  };

  input.isEnabled = true;

  const move = d => {
    if (input.isEnabled) {
      input.isEnabled = false;

      switch (d) {
        case 'up':
            new TWEEN.Tween(app.camera.position).to({y: [12.5, 10]}, 750).easing(TWEEN.Easing.Quadratic.Out)
              .onComplete(() => input.isEnabled = true).start();
            new TWEEN.Tween(app.camera.rotation).to({x: [-7.5 * Math.PI / 180, 0]}, 750).easing(TWEEN.Easing.Quadratic.Out)
              .start();
          break;
        case 'left':
          new TWEEN.Tween(app.camera.position).to({x: -1.25}, 375).easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => input.isEnabled = true).start();
          new TWEEN.Tween(app.camera.rotation).to({z: 5 * Math.PI / 180}, 375).easing(TWEEN.Easing.Quadratic.Out)
            .start();
            // new TWEEN.Tween(object.mesh.rotation).to({z: object.mesh.rotation.z - .5}, 375)
            //   .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => input.isEnabled = true).start();
          break;
        case 'right':
          new TWEEN.Tween(app.camera.position).to({x: 1.25}, 375).easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => input.isEnabled = true).start();
          new TWEEN.Tween(app.camera.rotation).to({z: -5 * Math.PI / 180}, 375).easing(TWEEN.Easing.Quadratic.Out)
            .start();
            // new TWEEN.Tween(object.mesh.rotation).to({z: object.mesh.rotation.z + .5}, 375)
            //   .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => input.isEnabled = true).start();
          break;
      }
    }
  };

  window.ontouchstart = e => {
    input.touch.start.x = e.changedTouches[0].clientX / window.innerWidth * 2 - 1;
    input.touch.start.y = e.changedTouches[0].clientY / window.innerHeight * -2 + 1;
  };

  window.ontouchend = e => {
    input.touch.end.x = e.changedTouches[0].clientX / window.innerWidth * 2 - 1;
    input.touch.end.y = e.changedTouches[0].clientY / window.innerHeight * -2 + 1;

    if (input.touch.start.x - input.touch.end.x > .25) move('right');
    else if (input.touch.start.x - input.touch.end.x < -.25) move('left');
    if (input.touch.start.y - input.touch.end.y > .25) move('down');
    else if (input.touch.start.y - input.touch.end.y < -.25) move('up');
  };

  document.getElementsByTagName('canvas')[0].ontouchstart = e => e.preventDefault();

  window.onkeydown = e => {
    switch (e.code) {
      case 'ArrowUp': case 'KeyW':
        move('up');
        break;
      case 'ArrowLeft': case 'KeyA':
        move('left');
        break;
      case 'ArrowRight': case 'KeyD':
        move('right');
        break;
    }
  };
}

function anim(t) {
  requestAnimationFrame(anim);

  TWEEN.update();

  app.time = t / 1000;

  object.mesh.rotation.x = app.time * .25;

  // if (object.shader) object.shader.uniforms.uTime.value = app.time;

  app.pass.shaderMaterial.uniforms.uTime.value = app.time;
  app.composer.render();
}