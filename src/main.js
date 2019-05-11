let app, light, geometry, material, shader, mesh, input, player, audio;

const getInt = (l, h) => Math.floor(Math.random() * (h - l) + l);

const map = (n, il, ih, ol, oh) => (n - il) * (oh - ol) / (ih - il) + ol;

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
    isEnabled: null,
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
    obstacle: null,
    snow: null,
    title: null,
  };
  material = {
    planet: null,
    tree: null,
    obstacle: null,
    snow: null,
    title: null,
  };
  shader = {
    planet: null,
    tree: null,
    obstacle: null,
    snow: null,
    title: null,
  };
  mesh = {
    planet: null,
    tree: null,
    obstacle: null,
    snow: null,
    title: null,
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
    transparent: true,
    opacity: .25,
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
      value: 1,
    };

    s.vertexShader = su + s.vertexShader;
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
  };

  mesh.planet = new THREE.Mesh(geometry.planet, material.planet);
  mesh.planet.receiveShadow = true;
  mesh.planet.rotation.set(0, 0, 90 * Math.PI / 180);
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
    opacity: .25,
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
      value: 1,
    };

    s.vertexShader = su + s.vertexShader;
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
  };

  mesh.tree = new THREE.Mesh(geometry.tree, material.tree);
  mesh.tree.castShadow = true;
  app.scene.add(mesh.tree);


  geometry.obstacle = new THREE.CylinderBufferGeometry(0, .25, 1);

  material.obstacle = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .5,
    color: getColor('bright'),
  });

  material.obstacle.onBeforeCompile = s => {
    shader.obstacle = s;

    s.uniforms.uTime = {
      value: 0,
    };
    s.uniforms.uMorph = {
      value: 30,
    };
    s.uniforms.uDistort = {
      value: 0,
    };

    s.vertexShader = su + s.vertexShader;
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
  };

  mesh.obstacle = new THREE.Mesh(geometry.obstacle, material.obstacle);
  mesh.obstacle.position.set(app.camera.position.x - .5, app.camera.position.y + 1, app.camera.position.z - 20);
  mesh.obstacle.rotation.set(90 * Math.PI / 180, 0, 0);
  app.scene.add(mesh.obstacle);


  geometry.snow = new THREE.Geometry();
  for (let i = 1000; i--;) geometry.snow.vertices.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()));

  material.snow = new THREE.PointsMaterial({
    size : .01,
    transparent: true,
    opacity: .25,
    depthWrite: false,
    color: getColor('normal'),
  });

  material.snow.onBeforeCompile = s => {
    shader.snow = s;

    s.uniforms.uTime = {
      value: 0,
    };
    s.uniforms.uMorph = {
      value: 10,
    };
    s.uniforms.uDistort = {
      value: 1,
    };

    s.vertexShader = su + s.vertexShader;
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
  };

  mesh.snow = new THREE.Points(geometry.snow, material.snow);
  mesh.snow.position.set(app.camera.position.x - .5, app.camera.position.y - .5, app.camera.position.z - 1);
  app.scene.add(mesh.snow);


  new THREE.FontLoader().load('json/VT323_Regular.json', f => {
    geometry.title = new THREE.TextBufferGeometry(' waraws\nLUNARINE', {
      font: f,
      size: .1,
      height: .01,
    });

    material.title = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: .75,
      color: getColor('dark'),
    });

    material.title.onBeforeCompile = s => {
      shader.title = s;

      s.uniforms.uTime = {
        value: 0,
      };
      s.uniforms.uMorph = {
        value: .75,
      };
      s.uniforms.uDistort = {
        value: .001,
      };

      s.vertexShader = su + s.vertexShader;
      s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', sv);
    };

    mesh.title = new THREE.Mesh(geometry.title, material.title);
    mesh.title.position.set(app.camera.position.x - .225, app.camera.position.y + .1, app.camera.position.z - 1.25);
    app.scene.add(mesh.title);
  });
}

function post() {
  app.composer = new THREE.EffectComposer(app.renderer);
  app.composer.addPass(new THREE.RenderPass(app.scene, app.camera));
  app.composer.addPass(app.pass = new THREE.Post());
  app.pass.renderToScreen = true;
}

function sound() {
  audio = {
    listener: null,
    loader: null,
    sample: null,
    analyser: null,
    amplitude: null,
  };

  audio.listener = new THREE.AudioListener();
  app.camera.add(audio.listener);

  audio.loader = new THREE.AudioLoader();

  audio.sample = new THREE.Audio(audio.listener);
  audio.loader.load('mp3/audio.mp3', b => {
    audio.sample.setBuffer(b);
    audio.sample.setLoop(true);
    audio.sample.play();
  });

  audio.analyser = new THREE.AudioAnalyser(audio.sample); // ? + ', 32'
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
  };

  player = {
    isFacing: null,
    isMoving: null,
  };

  const act = a => {
    switch (a) {
      case 'move':
        player.isMoving = true;
        break;
      case 'turn':
        player.isFacing += 90 * Math.PI / 180;
        break;
    }

    if (!app.isEnabled) {
      app.isEnabled = true;

      sound();

      app.scene.remove(mesh.title);
      material.planet.opacity = .75;
      material.tree.opacity = .75;
    }
  };

  window.ontouchstart = e => {
    input.touch.start.x = e.changedTouches[0].clientX / window.innerWidth * 2 - 1;
    input.touch.start.y = e.changedTouches[0].clientY / window.innerHeight * -2 + 1;

    act('move');
  };

  window.ontouchend = e => {
    input.touch.end.x = e.changedTouches[0].clientX / window.innerWidth * 2 - 1;
    input.touch.end.y = e.changedTouches[0].clientY / window.innerHeight * -2 + 1;

    player.isMoving = false;

    // // if (input.touch.start.x - input.touch.end.x > .25) ;
    // // else if (input.touch.start.x - input.touch.end.x < -.25) ;
    // if (Math.abs(input.touch.start.x - input.touch.end.x) < .25) {
    //   // if (input.touch.start.y - input.touch.end.y < .25) ;
    //   if (input.touch.start.y - input.touch.end.y > .25) act('turn');
    // }
    if (Math.abs(input.touch.start.x - input.touch.end.x) < .25 &&
      input.touch.start.y - input.touch.end.y > .25) act('turn');
  };

  document.getElementsByTagName('canvas')[0].ontouchstart = e => e.preventDefault();

  window.onkeydown = e => {
    switch (e.code) {
      case 'ArrowUp': case 'KeyW':
        act('move');
        break;
      case 'ArrowDown': case 'KeyS':
        act('turn');
        break;
    }
  };

  window.onkeyup = e => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') player.isMoving = false;
  };
}

function anim(t) {
  requestAnimationFrame(anim);

  if (app.isEnabled) {
    mesh.planet.rotation.x += .0075;
    mesh.tree.rotation.x += .0075;

    mesh.obstacle.position.y -= .0025;
    mesh.obstacle.position.z += .075;
    if (mesh.obstacle.position.z > app.camera.position.z) {
      mesh.obstacle.position.y = app.camera.position.y + 1;
      mesh.obstacle.position.z = app.camera.position.z - 20;
    }
  }

  if (player.isMoving) {
    mesh.planet.rotation.x += .01;
    mesh.tree.rotation.x += .01;
  }
  if (mesh.planet.rotation.y < player.isFacing) {
    mesh.planet.rotation.y += .1;
    mesh.tree.rotation.y += .1;
  } else {
    mesh.planet.rotation.y = player.isFacing;
    mesh.tree.rotation.y = player.isFacing;
  }

  app.time = t / 1000;

  // mesh.snow.rotation.x = Math.sin(app.time) / 2;

  Object.keys(shader).forEach(k => {
    if (shader[k]) shader[k].uniforms.uTime.value = app.time;
  });

  // https://threejs.org/docs/index.html#api/en/audio/AudioAnalyser
  if (app.isEnabled) {
    audio.amplitude = map(audio.analyser.getFrequencyData()[0], 0, 255, .1, 2);
    shader.planet.uniforms.uDistort.value = audio.amplitude;
    shader.tree.uniforms.uDistort.value = audio.amplitude;
    shader.obstacle.uniforms.uDistort.value = audio.amplitude;
    shader.snow.uniforms.uDistort.value = audio.amplitude;
    // console.log(map(audio.analyser.data[0], 0, 255, 0, 10))
  }

  app.pass.shaderMaterial.uniforms.uTime.value = app.time;
  app.composer.render();
}