const random = (l, h) => Math.floor(Math.random() * (h - l) + l)

const map = (n, il, ih, ol, oh) => (n - il) * (oh - ol) / (ih - il) + ol

const color = b => {
  let l = 10

  switch (b) {
    case 'bright': l *= 2
    case 'normal': l *= 2
    case 'dark': l *= 2
  }

  return `hsl(${random(0, 360)}, ${random(0, 101)}%, ${l}%)`
}

function Game() {
  const c = color('bright')
  let g = 0

  this.renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByTagName('canvas')[0],
  })
  this.renderer.setPixelRatio(.2)
  this.renderer.setSize(window.innerWidth, window.innerHeight)
  this.renderer.setClearColor(c)
  this.renderer.shadowMap.enabled = true

  this.scene = new THREE.Scene()
  this.scene.fog = new THREE.FogExp2(c, .075)

  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000)
  this.camera.position.set(0, 10, 7.5)
  this.scene.add(this.camera)

  this.pass = new THREE.Post()
  this.pass.renderToScreen = true

  this.composer = new THREE.EffectComposer(this.renderer)
  this.composer.addPass(new THREE.RenderPass(this.scene, this.camera))
  this.composer.addPass(this.pass)

  this.running = false

  this.begin = () => {
    if (g) {
      this.running = true

      material.groundL.opacity = 1
      material.groundR.opacity = 1
      material.tree.opacity = .75

      game.scene.remove(score.mesh)
      game.scene.add(mesh.enemy)

      mesh.animation.forEach(a => a.start())
    } else {
      g++

      audio = new Audio()

      new TWEEN.Tween(material.text).to({opacity: 0}, 1).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        // ! +- `1` => `1250`
        game.scene.remove(title.mesh)
        game.scene.add(instructions.mesh)

        new TWEEN.Tween(material.text).to({opacity: .75}, 1).easing(TWEEN.Easing.Quadratic.Out) // ! +- `1`
          .onComplete(() => {
          this.running = true

          material.groundL.opacity = 1
          material.groundR.opacity = 1
          material.tree.opacity = .75

          game.scene.remove(instructions.mesh)
          game.scene.add(mesh.enemy)

          mesh.animation.forEach(a => a.start())
        }).start()
      }).start()
    }
  }

  this.end = () => {
    this.running = false

    material.groundL.opacity = .25
    material.groundR.opacity = .25
    material.tree.opacity = .25
    material.text.opacity = .75

    shader.tree.uniforms.uDistort.value = .75

    score = new Text(`SCORE:${('00000' + Math.round(player.score)).slice(-5)}`, new THREE.Vector3(-.3, 10.1, 6.25))
    game.scene.remove(mesh.enemy)

    mesh.animation.forEach(a => a.stop())

    player.is = 'center'
    player.score = 0

    game.camera.position.x = 0
    game.pass.shader.uniforms.uAmount.value = .75

    mesh.groundL.rotation.x = 0
    mesh.groundR.rotation.x = 0
    mesh.tree.rotation.x = 0
    mesh.enemy.position.y = 12.5
    mesh.enemy.rotation.y = 0
  }

  this.time = 0

  window.onorientationchange = () => location.reload()

  window.onresize = () => {
    this.renderer.setPixelRatio(.2)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.pass.setSize(window.innerWidth, window.innerHeight)
    this.composer.reset()
  }
}

function Light() {
  const c = color('bright')

  this.ambient = new THREE.AmbientLight(c, .5)
  game.scene.add(this.ambient)

  this.point = new THREE.PointLight(c, .5, 100)
  this.point.position.set(5, 5, 5)
  this.point.castShadow = true
  this.point.shadow.mapSize = new THREE.Vector2(512, 512)
  game.camera.add(this.point)
}

function Geometry() {
  const cb = new THREE.Color(color('bright'))
  const cd = new THREE.Color(color('dark'))

  this.groundL = new THREE.SphereGeometry(10, 24, 24)
  this.groundL.vertices.forEach(v => v.y = Math.max(v.y, 0))
  this.groundL.faces.forEach((f, i) => f.color = i % 2 ? cb : cd)

  this.groundR = new THREE.SphereGeometry(10, 24, 24)
  this.groundR.vertices.forEach(v => v.y = Math.min(v.y, 0))
  this.groundR.faces.forEach((f, i) => f.color = i % 2 ? cb : cd)

  this.tree = new THREE.Geometry()
  this.groundL.faces.forEach((f, i) => {
    if (!(i % 20)) {
      const g = new THREE.CylinderGeometry(0, .25, 5)
      g.rotateX(90 * Math.PI / 180)
      g.lookAt(f.normal)
      g.translate(f.normal.x * 10, f.normal.y * 10, f.normal.z * 10)
      this.tree.merge(g)
    }
  })

  this.enemy = new THREE.OctahedronBufferGeometry(1)

  this.snow = new THREE.Geometry()
  for (let i = 1000; i--;) this.snow.vertices.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()))
}

function Material() {
  const c = color('bright')

  this.groundL = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .25,
    vertexColors: THREE.FaceColors,
  })

  this.groundR = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .25,
    vertexColors: THREE.FaceColors,
  })

  this.tree = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    depthWrite: false,
    transparent: true,
    opacity: .25,
    color: color('bright'),
  })

  this.enemy = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .75,
    color: c,
  })

  this.snow = new THREE.PointsMaterial({
    size: .01,
    depthWrite: false,
    transparent: true,
    opacity: .25,
    color: color('normal'),
  })

  this.text = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .75,
    color: color('dark'),
  })
}

function Shader() {
  const u = `
    uniform float uTime;
    uniform float uMorph;
    uniform float uDistort;
  `
  const v = `
    vec3 transformed = vec3(position);

    transformed.x += sin((position.x + uTime * .375) * 20.) * .0015 * uMorph;
    transformed.y += sin((position.y + uTime * .375) * 20.) * .0015 * uMorph;
    transformed.z += sin((position.z + uTime * .375) * 20.) * .0015 * uMorph;

    if (uDistort > 0.) {
      transformed.x += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
      transformed.y += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
      transformed.z += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;
    }
  `

  this.uTime = []

  material.groundL.onBeforeCompile = s => {
    this.groundL = s

    this.uTime.push(s.uniforms.uTime = {value: 0})
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .1}

    s.vertexShader = u + s.vertexShader
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', v.substring(0, v.indexOf(';') + 1) + `
        transformed.y *= 2.;
      ` + v.substring(v.indexOf(';') + 1))
  }

  material.groundR.onBeforeCompile = s => {
    this.groundR = s

    this.uTime.push(s.uniforms.uTime = {value: 0})
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .1}

    s.vertexShader = u + s.vertexShader
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', v.substring(0, v.indexOf(';') + 1) + `
        transformed.y *= 2.;
      ` + v.substring(v.indexOf(';') + 1))
  }

  material.tree.onBeforeCompile = s => {
    this.tree = s

    this.uTime.push(s.uniforms.uTime = {value: 0})
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .75}

    s.vertexShader = u + s.vertexShader
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', v)
  }

  material.enemy.onBeforeCompile = s => {
    this.enemy = s

    this.uTime.push(s.uniforms.uTime = {value: 0})
    s.uniforms.uMorph = {value: 20}
    s.uniforms.uDistort = {value: 1}

    s.vertexShader = u + s.vertexShader
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', v.substring(0, v.indexOf(';') + 1) + `
        transformed.x *= .75;
        transformed.y *= 1.5;
        transformed.z *= .75;
      ` + v.substring(v.indexOf(';') + 1))
  }

  material.snow.onBeforeCompile = s => {
    this.snow = s

    this.uTime.push(s.uniforms.uTime = {value: 0})
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: 1}

    s.vertexShader = u + s.vertexShader
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', v)
  }

  material.text.onBeforeCompile = s => {
    this.text = s

    this.uTime.push(s.uniforms.uTime = {value: 0})
    s.uniforms.uMorph = {value: .75}
    s.uniforms.uDistort = {value: .001}

    s.vertexShader = u + s.vertexShader
    s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', v)
  }

  this.distort = 'left'
}

function Mesh() {
  this.animation = []

  this.groundL = new THREE.Mesh(geometry.groundL, material.groundL)
  this.groundL.receiveShadow = true
  this.groundL.rotation.set(0, 0, 90 * Math.PI / 180)
  game.scene.add(this.groundL)
  this.animation.push(new TWEEN.Tween(this.groundL.rotation).to({x: 360 * Math.PI / 180}, 10000).repeat(Infinity))

  this.groundR = new THREE.Mesh(geometry.groundR, material.groundR)
  this.groundR.receiveShadow = true
  this.groundR.rotation.set(0, 0, 90 * Math.PI / 180)
  game.scene.add(this.groundR)
  this.animation.push(new TWEEN.Tween(this.groundR.rotation).to({x: 360 * Math.PI / 180}, 10000).repeat(Infinity))

  this.tree = new THREE.Mesh(geometry.tree, material.tree)
  this.tree.castShadow = true
  game.scene.add(this.tree)
  this.animation.push(new TWEEN.Tween(this.tree.rotation).to({x: 360 * Math.PI / 180}, 10000).repeat(Infinity))

  this.enemy = new THREE.Mesh(geometry.enemy, material.enemy)
  this.enemy.castShadow = true
  this.enemy.position.set(-1.5, 12.5, -12.5)
  this.animation.push(new TWEEN.Tween(this.enemy.position).to({y: [12, 13, 12.5]}, 10000).repeat(Infinity))
  this.animation.push(new TWEEN.Tween(this.enemy.rotation).to({y: 360 * Math.PI / 180}, 10000).repeat(Infinity))

  this.snow = new THREE.Points(geometry.snow, material.snow)
  game.scene.add(this.snow)

  // ? move
  const l = new TWEEN.Tween(this.enemy.position).to({x: -1.5}, 5000).easing(TWEEN.Easing.Quadratic.In)
    .onComplete(() => shader.distort = 'left')
  const r = new TWEEN.Tween(this.enemy.position).to({x: 1.5}, 5000).easing(TWEEN.Easing.Quadratic.In)
    .onComplete(() => shader.distort = 'right')
  const t1 = new TWEEN.Tween().to({}, 5000)
  const t2 = new TWEEN.Tween().to({}, 5000)
  const d = () => {
    if (!random(0, 5)) {
      if (shader.distort === 'left') r.start()
      else l.start()
    }
  }
  t1.onComplete(() => {
    d()
    t2.start()
  }).start()
  t2.onComplete(() => {
    d()
    t1.start()
  }).start()
}

function Text(t, p, v = true) {
  new THREE.FontLoader().load('json/VT323_Regular.json', f => {
    this.mesh = new THREE.Mesh(new THREE.TextBufferGeometry(t, {font: f, size: .1, height: .01}), material.text)
    this.mesh.position.copy(p)
    if (v) game.scene.add(this.mesh)
  })
}

function Player() {
  let m = false
  this.is = 'center'

  const l = new TWEEN.Tween(game.camera.position).to({x: -1.5}, 250).easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => m = false)
  const r = new TWEEN.Tween(game.camera.position).to({x: 1.5}, 250).easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => m = false)

  const mo = d => {
    if (!m) {
      switch (d) {
        case 'left':
          if (this.is !== 'left') {
            m = true
            this.is = 'left'

            l.start()
          }
          break
        case 'right':
          if (this.is !== 'right') {
            m = true
            this.is = 'right'

            r.start()
          }
          break
      }
    }
  }

  window.onkeydown = e => {
    if (game.running) {
      switch (e.code) {
        case 'ArrowLeft': case 'KeyA': mo('left')
          break
        case 'ArrowRight': case 'KeyD': mo('right')
          break
      }
    } else game.begin()
  }

  let sX, sY, eX, eY

  window.ontouchstart = e => {
    sX = e.changedTouches[0].clientX / window.innerWidth * 2 - 1
    sY = e.changedTouches[0].clientY / window.innerHeight * -2 + 1

    if (!game.running) game.begin()
  }

  window.ontouchend = e => {
    eX = e.changedTouches[0].clientX / window.innerWidth * 2 - 1
    eY = e.changedTouches[0].clientY / window.innerHeight * -2 + 1

    if (Math.abs(sY - eY) < .25 && sX - eX < -.25) mo('left')
    else if (Math.abs(sY - eY) < .25 && sX - eX > .25) mo('right')
  }

  document.getElementsByTagName('canvas')[0].ontouchstart = e => e.preventDefault()

  this.score = 0
}

function Audio() {
  const li = new THREE.AudioListener()
  game.camera.add(li)

  const lo = new THREE.AudioLoader()

  this.s = new THREE.Audio(li)
  lo.load('mp3/audio.mp3', b => {
    this.s.setBuffer(b)
    this.s.setLoop(true)
    this.s.play()
  })

  this.analyser = new THREE.AudioAnalyser(this.s) // ? + `, 32`

  // window.onblur = () => this.s.setVolume(0)
  // window.onfocus = () => this.s.setVolume(1)
}

let game, light, geometry, material, shader, mesh, title, instructions, animation, audio, score

function initialize() {
  game = new Game()
  light = new Light()
  geometry = new Geometry()
  material = new Material()
  shader = new Shader()
  mesh = new Mesh()
  title = new Text(' waraws\nLUNARINE', new THREE.Vector3(-.225, 10.1, 6.25))
  instructions = new Text('PRESSad<-->\n\n   AVOID\n DISTORTED\n   AREAS\n\nSWIPEriglef',
    new THREE.Vector3(-.3, 10.5125, 5.75), false)
  player = new Player()

  animate()
}

function animate(t) {
  requestAnimationFrame(animate)

  TWEEN.update()

  game.time = t * .001

  mesh.snow.position.set(game.camera.position.x - .5, game.camera.position.y - .5, 6.5)

  if (game.running) {
    const a = map(audio.analyser.getFrequencyData()[0], 0, 255, .1, 2)
    if (shader.distort === 'left') {
      if (shader.groundL) shader.groundL.uniforms.uDistort.value = a * 2
      if (shader.groundR) shader.groundR.uniforms.uDistort.value = .1

      if (player.is === 'left' && shader.groundL.uniforms.uDistort.value > .2) {
        console.log('damage') // ! -
        if (game.pass.shader.uniforms.uAmount.value < 1) game.pass.shader.uniforms.uAmount.value += .0025
        else game.pass.shader.uniforms.uAmount.value = 1
      } else if (player.is === 'right') {
        if (game.pass.shader.uniforms.uAmount.value > .75) game.pass.shader.uniforms.uAmount.value -= .0025
        else game.pass.shader.uniforms.uAmount.value = .75
      }
    } else {
      if (shader.groundL) shader.groundL.uniforms.uDistort.value = .1
      if (shader.groundR) shader.groundR.uniforms.uDistort.value = a * 2

      if (player.is === 'right' && shader.groundR.uniforms.uDistort.value > .2) {
        console.log('damage') // ! -
        if (game.pass.shader.uniforms.uAmount.value < 1) game.pass.shader.uniforms.uAmount.value += .0025
        else game.pass.shader.uniforms.uAmount.value = 1
      } else if (player.is === 'left') {
        if (game.pass.shader.uniforms.uAmount.value > .75) game.pass.shader.uniforms.uAmount.value -= .0025
        else game.pass.shader.uniforms.uAmount.value = .75
      }
    }
    if (shader.tree) shader.tree.uniforms.uDistort.value = a
    if (shader.enemy) shader.enemy.uniforms.uDistort.value = a * 1.25
    if (shader.snow) shader.snow.uniforms.uDistort.value = a

    if (player.is !== 'center') player.score += .01 // ? +- `+= .01`
  }

  shader.uTime.forEach(u => u.value = game.time)

  game.pass.shader.uniforms.uTime.value = game.time
  game.composer.render()
}