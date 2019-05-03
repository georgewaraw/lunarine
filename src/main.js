let app, light, geometry, material, shader, mesh, input;

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

  let cl = getColor('bright');

  light.ambient = new THREE.AmbientLight(cl, .5);
  app.scene.add(light.ambient);

  light.point = new THREE.PointLight(cl, .5, 100);
  light.point.position.set(5, 5, 5);
  light.point.castShadow = true;
  light.point.shadow.mapSize = new THREE.Vector2(512, 512);
  app.camera.add(light.point);


  geometry = {
    planet: null,
    tree: null,
  };

  material = {
    planet: null,
    tree: null,
  };

  shader = {
    planet: null,
    tree: null,
  };

  mesh = {
    planet: null,
    tree: null,
  };


  const su = `
    uniform float uTime;
    uniform float uMorph;
    uniform float uDistort;
  `;
  const sv = `
    vec3 transformed = vec3(position);

    transformed.x += sin((position.x + uTime * .375) * 20.) * .0015 * uMorph;
    transformed.y += sin((position.y + uTime * .375) * 20.) * .0015 * uMorph;
    transformed.z += sin((position.z + uTime * .375) * 20.) * .0015 * uMorph;

    if (uDistort > 0.) {
      transformed.x += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
      transformed.y += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
      transformed.z += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
    }
  `;


  geometry.planet = new THREE.SphereGeometry(10, 24, 24);
  const cpd = new THREE.Color(getColor('dark'));
  const cpb = new THREE.Color(getColor('bright'));
  geometry.planet.faces.forEach((f, i) => f.color = i % 2 ? cpd : cpb);

  material.planet = new THREE.MeshLambertMaterial({
    vertexColors: THREE.FaceColors,
  });

  material.planet.onBeforeCompile = s => {
    shader.planet = s;

    s.uniforms.uTime = {
      value: 0,
    };
    s.uniforms.uMorph = {
      value: 10,
    };
    s.uniforms.uDistort = {
      value: 0,
    };

    s.vertexShader = su + s.vertexShader;
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
  };

  mesh.planet = new THREE.Mesh(geometry.planet, material.planet);
  app.scene.add(mesh.planet);


  geometry.tree = new THREE.Geometry();
  geometry.planet.faces.forEach((f, i) => {
    if (!(i % 20)) {
      // let gt = new THREE.PlaneGeometry(2, 1);
      // gt.rotateY(270 * Math.PI / 180);
      let gt = new THREE.CylinderGeometry(0, .25, 5);
      gt.rotateX(90 * Math.PI / 180);
      gt.lookAt(f.normal);
      gt.translate(f.normal.x * 10, f.normal.y * 10, f.normal.z * 10);
      geometry.tree.merge(gt);
    }
  });

  material.tree = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    depthWrite: false,
    transparent: true,
    opacity: .75,
    color: getColor('bright'),
  });

  material.tree.onBeforeCompile = s => {
    shader.tree = s;

    s.uniforms.uTime = {
      value: 0,
    };
    s.uniforms.uMorph = {
      value: 10,
    };
    s.uniforms.uDistort = {
      value: 0,
    };

    s.vertexShader = su + s.vertexShader;
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
  };

  mesh.tree = new THREE.Mesh(geometry.tree, material.tree);
  app.scene.add(mesh.tree);


  // const msh = new THREE.Mesh(, material.tree)
  // msh.position.y = 5
  // msh.position.z = -20
  // app.scene.add(msh)
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
        case 'forward':
          new TWEEN.Tween(mesh.planet.rotation).to({x: mesh.planet.rotation.x + .5}, 250)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => input.isEnabled = true).start();
          new TWEEN.Tween(mesh.tree.rotation).to({x: mesh.tree.rotation.x + .5}, 250)
            .easing(TWEEN.Easing.Quadratic.Out).start();
          break;
        case 'turn':
          new TWEEN.Tween(mesh.planet.rotation).to({z: mesh.planet.rotation.z + 90 * Math.PI / 180}, 250)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => input.isEnabled = true).start();
          new TWEEN.Tween(mesh.tree.rotation).to({z: mesh.tree.rotation.z + 90 * Math.PI / 180}, 250)
            .easing(TWEEN.Easing.Quadratic.Out).start();
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

    // if (input.touch.start.x - input.touch.end.x > .25) move('right');
    // else if (input.touch.start.x - input.touch.end.x < -.25) move('left');
    if (Math.abs(input.touch.start.x - input.touch.end.x) < .25) {
      if (input.touch.start.y - input.touch.end.y < .25) move('forward');
      else if (input.touch.start.y - input.touch.end.y > -.25) move('turn');
    }
  };

  document.getElementsByTagName('canvas')[0].ontouchstart = e => e.preventDefault();

  window.onkeydown = e => {
    switch (e.code) {
      case 'ArrowUp': case 'KeyW':
        move('forward');
        break;
      case 'ArrowDown': case 'KeyS':
        move('turn');
        break;
      // case 'ArrowLeft': case 'KeyA':
      //   // move('left');
      //   break;
      // case 'ArrowRight': case 'KeyD':
      //   // move('right');
      //   break;
    }
  };
}

function anim(t) {
  requestAnimationFrame(anim);

  TWEEN.update();

  app.time = t / 1000;

  Object.keys(shader).forEach(k => {
    if (shader[k]) shader[k].uniforms.uTime.value = app.time;
  });

  app.pass.shaderMaterial.uniforms.uTime.value = app.time;
  app.composer.render();
}