const getNumber = (l, h) => Math.floor(Math.random() * (h - l) + l)

const mapNumber = (n, iL, iH, oL, oH) => (n - iL) * (oH - oL) / (iH - iL) + oL

const getColor = b => {
  let l = 40

  if (b === `dark`) l /= 2
  else if (b === `light`) l *= 2

  return `hsl(${getNumber(0, 360)}, ${getNumber(0, 101)}%, ${l}%)`
}

function Game() {
  const color = getColor(`light`)

  const renderer = new THREE.WebGLRenderer({canvas: document.getElementsByTagName(`canvas`)[0]})
  renderer.setPixelRatio(.2)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(color)
  renderer.shadowMap.enabled = true

  this.scene = new THREE.Scene()
  this.scene.fog = new THREE.FogExp2(color, .075)

  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000)
  this.camera.position.set(0, 10, 7.5)

  this.pass = new THREE.Post()
  this.pass.renderToScreen = true

  this.composer = new THREE.EffectComposer(renderer)
  this.composer.addPass(new THREE.RenderPass(this.scene, this.camera))
  this.composer.addPass(this.pass)

  window.onresize = () => {
    renderer.setPixelRatio(.2)
    renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.pass.setSize(window.innerWidth, window.innerHeight)

    this.composer.reset()
  }

  window.onorientationchange = () => location.reload()

  const lightAmbient = new THREE.AmbientLight(color, .5)
  this.scene.add(lightAmbient)

  const lightPoint = new THREE.PointLight(color, .5, 100)
  lightPoint.shadow.mapSize = new THREE.Vector2(512, 512)
  lightPoint.castShadow = true
  lightPoint.position.set(5, 15, 10)
  this.scene.add(lightPoint)

  this.state = ``

  this.start = () => {
    audio = new Audio()

    this.state = `started`

    material.sphereLeft.opacity = 1
    material.sphereRight.opacity = 1
    material.cylinder.opacity = .75

    this.scene.remove(textTitle)
    this.scene.add(mesh.octahedron)

    new TWEEN.Tween(mesh.octahedron.position).to({y: [12, 13, 12.5]}, 10000).repeat(Infinity).start()

    const moveLeft = new TWEEN.Tween(mesh.octahedron.position).to({x: -1.5}, 500).easing(TWEEN.Easing.Quadratic.In)
    const moveRight = new TWEEN.Tween(mesh.octahedron.position).to({x: 1.5}, 500).easing(TWEEN.Easing.Quadratic.In)
    setInterval(() => {
      if (getNumber(0, 2)) {
        if (mesh.octahedron.position.x === 1.5) moveLeft.start()
        else if (mesh.octahedron.position.x === -1.5) moveRight.start()
      }
    }, 1500)
  }

  this.stop = () => {
    this.state = `stopped`
    this.camera.position.x = 0
    this.pass.shader.uniforms.uAmount.value = .75

    material.sphereLeft.opacity = .25
    material.sphereRight.opacity = .25
    material.cylinder.opacity = .25

    shader.cylinder.uniforms.uDistort.value = .75

    this.scene.remove(mesh.octahedron)
    new THREE.FontLoader().load(`json/VT323_Regular.json`, f => {
      const textScore = new THREE.Mesh(new THREE.TextBufferGeometry(
        `SCORE\n${(`00000` + Math.round(player.score)).slice(-5)}`, {font: f, size: .1, height: .01}), material.text)
      textScore.position.set(-.1375, 10.1, 6.25)
      game.scene.add(textScore)
    })
  }
}

function Geometry() {
  const colorDark = new THREE.Color(getColor(`dark`))
  const colorLight = new THREE.Color(getColor(`light`))

  this.sphereLeft = new THREE.SphereGeometry(10, 24, 24)
  this.sphereRight = this.sphereLeft.clone()
  this.sphereLeft.vertices.forEach(v => v.y = Math.max(v.y, 0))
  this.sphereRight.vertices.forEach(v => v.y = Math.min(v.y, 0))
  this.sphereLeft.faces.forEach((f, i) => f.color = i % 2 ? colorDark : colorLight)
  this.sphereRight.faces.forEach((f, i) => f.color = i % 2 ? colorDark : colorLight)

  this.cylinder = new THREE.Geometry()
  this.sphereLeft.faces.forEach((f, i) => {
    if (!(i % 20)) {
      const geometry = new THREE.CylinderGeometry(0, .25, 5)
      geometry.rotateX(90 * Math.PI / 180)
      geometry.lookAt(f.normal)
      geometry.translate(f.normal.x * 10, f.normal.y * 10, f.normal.z * 10)
      this.cylinder.merge(geometry)
    }
  })

  this.octahedron = new THREE.OctahedronBufferGeometry(1)

  this.points = new THREE.Geometry()
  for (let i = 1000; i--;) this.points.vertices.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()))
}

function Material() {
  const color = getColor(`light`)

  this.sphereLeft = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .25,
    vertexColors: THREE.FaceColors
  })
  this.sphereRight = this.sphereLeft.clone()

  this.cylinder = new THREE.MeshLambertMaterial({
    depthWrite: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: .25,
    color: color
  })

  this.octahedron = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .75,
    color: color
  })

  this.points = new THREE.PointsMaterial({
    depthWrite: false,
    size: .01,
    transparent: true,
    opacity: .25,
    color: getColor()
  })

  this.text = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .75,
    color: getColor(`dark`)
  })
}

function Shader() {
  const uniforms = `
    uniform float uTime;
    uniform float uMorph;
    uniform float uDistort;
  `
  const shader = `
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

  material.sphereLeft.onBeforeCompile = s => {
    this.sphereLeft = s

    s.uniforms.uTime = {value: 0}
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .1}

    s.vertexShader = uniforms + s.vertexShader
    s.vertexShader = s.vertexShader.replace(`#include <begin_vertex>`, shader.substring(0, shader.indexOf(`;`) + 1) + `
      transformed.y *= 2.;
    ` + shader.substring(shader.indexOf(`;`) + 1))
  }
  material.sphereRight.onBeforeCompile = s => {
    this.sphereRight = s

    s.uniforms.uTime = {value: 0}
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .1}

    s.vertexShader = uniforms + s.vertexShader
    s.vertexShader = s.vertexShader.replace(`#include <begin_vertex>`, shader.substring(0, shader.indexOf(`;`) + 1) + `
      transformed.y *= 2.;
    ` + shader.substring(shader.indexOf(`;`) + 1))
  }

  material.cylinder.onBeforeCompile = s => {
    this.cylinder = s

    s.uniforms.uTime = {value: 0}
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .75}

    s.vertexShader = uniforms + s.vertexShader
    s.vertexShader = s.vertexShader.replace(`#include <begin_vertex>`, shader)
  }

  material.octahedron.onBeforeCompile = s => {
    this.octahedron = s

    s.uniforms.uTime = {value: 0}
    s.uniforms.uMorph = {value: 20}
    s.uniforms.uDistort = {value: .1}

    s.vertexShader = uniforms + s.vertexShader
    s.vertexShader = s.vertexShader.replace(`#include <begin_vertex>`, shader.substring(0, shader.indexOf(`;`) + 1) + `
      transformed.x *= .75;
      transformed.y *= 1.5;
      transformed.z *= .75;
    ` + shader.substring(shader.indexOf(`;`) + 1))
  }

  material.points.onBeforeCompile = s => {
    this.points = s

    s.uniforms.uTime = {value: 0}
    s.uniforms.uMorph = {value: 10}
    s.uniforms.uDistort = {value: .75}

    s.vertexShader = uniforms + s.vertexShader
    s.vertexShader = s.vertexShader.replace(`#include <begin_vertex>`, shader)
  }

  material.text.onBeforeCompile = s => {
    this.text = s

    s.uniforms.uTime = {value: 0}
    s.uniforms.uMorph = {value: .75}
    s.uniforms.uDistort = {value: .001}

    s.vertexShader = uniforms + s.vertexShader
    s.vertexShader = s.vertexShader.replace(`#include <begin_vertex>`, shader)
  }
}

function Mesh() {
  this.sphereLeft = new THREE.Mesh(geometry.sphereLeft, material.sphereLeft)
  this.sphereLeft.receiveShadow = true
  this.sphereLeft.rotation.set(0, 0, 90 * Math.PI / 180)
  game.scene.add(this.sphereLeft)
  this.sphereRight = new THREE.Mesh(geometry.sphereRight, material.sphereRight)
  this.sphereRight.receiveShadow = true
  this.sphereRight.rotation.set(0, 0, 90 * Math.PI / 180)
  game.scene.add(this.sphereRight)

  this.cylinder = new THREE.Mesh(geometry.cylinder, material.cylinder)
  this.cylinder.castShadow = true
  game.scene.add(this.cylinder)

  this.octahedron = new THREE.Mesh(geometry.octahedron, material.octahedron)
  this.octahedron.position.set(-1.5, 12.5, -12.5)

  this.points = new THREE.Points(geometry.points, material.points)
  game.scene.add(this.points)
}

function Player() {
  let isMoving = false

  const moveLeft = new TWEEN.Tween(game.camera.position).to({x: -1.5}, 250).easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => isMoving = false)
  const moveRight = new TWEEN.Tween(game.camera.position).to({x: 1.5}, 250).easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => isMoving = false)

  const move = d => {
    if (!isMoving) {
      if (d === `left` && game.camera.position.x >= 0) {
        isMoving = true

        moveLeft.start()
      }
      else if (d === `right` && game.camera.position.x <= 0) {
        isMoving = true

        moveRight.start()
      }
    }
  }

  window.onkeydown = e => {
    switch (game.state) {
      case `started`:
        switch (e.code) {
          case `ArrowLeft`: case `KeyA`: move(`left`)
            break
          case `ArrowRight`: case `KeyD`: move(`right`)
            break
        }
        break
      case `stopped`: location.reload()
        break
      default: game.start()
    }
  }

  let startX, startY

  window.ontouchstart = e => {
    startX = e.changedTouches[0].clientX / window.innerWidth * 2 - 1
    startY = e.changedTouches[0].clientY / window.innerHeight * -2 + 1
  }

  window.ontouchend = e => {
    const endX = e.changedTouches[0].clientX / window.innerWidth * 2 - 1
    const endY = e.changedTouches[0].clientY / window.innerHeight * -2 + 1

    switch (game.state) {
      case `started`:
        if (Math.abs(startY - endY) < .25 && startX - endX < -.25) move(`left`)
        else if (Math.abs(startY - endY) < .25 && startX - endX > .25) move(`right`)
        break
      case `stopped`: location.reload()
        break
      default: game.start()
    }
  }

  document.getElementsByTagName(`canvas`)[0].ontouchstart = e => e.preventDefault()

  this.score = 0
}

function Audio() {
  const listener = new THREE.AudioListener()
  game.camera.add(listener)

  const loader = new THREE.AudioLoader()

  const audio = new THREE.Audio(listener)
  loader.load(`mp3/audio.mp3`, b => {
    audio.setBuffer(b)
    audio.setLoop(true)
    audio.play()
  })

  this.analyser = new THREE.AudioAnalyser(audio) // ? + `, 32`

  window.onblur = () => audio.setVolume(0)
  window.onfocus = () => audio.setVolume(1)
}

function setup() {
  game = new Game()
  geometry = new Geometry()
  material = new Material()
  shader = new Shader()
  mesh = new Mesh()
  player = new Player()

  new THREE.FontLoader().load(`json/VT323_Regular.json`, f => {
    textTitle = new THREE.Mesh(
      new THREE.TextBufferGeometry(` waraws\nLUNARINE`, {font: f, size: .1, height: .01}), material.text)
    textTitle.position.set(-.225, 10.1, 6.25)
    game.scene.add(textTitle)
  })

  draw()
}

function draw(t) {
  requestAnimationFrame(draw)

  TWEEN.update()

  const time = t / 1000

  mesh.points.position.set(game.camera.position.x - .5, game.camera.position.y - .5, 6.5)

  if (game.state === `started`) {
    mesh.sphereLeft.rotation.x = time / 2
    mesh.sphereRight.rotation.x = time / 2
    mesh.cylinder.rotation.x = time / 2
    mesh.octahedron.rotation.y = time / 2

    const amplitude = mapNumber(audio.analyser.getFrequencyData()[0], 0, 255, .1, 2)
    if (mesh.octahedron.position.x === -1.5) {
      if (shader.sphereLeft) shader.sphereLeft.uniforms.uDistort.value = amplitude * 2

      if (game.camera.position.x === -1.5 && shader.sphereLeft.uniforms.uDistort.value > .2) {
        if (game.pass.shader.uniforms.uAmount.value < 1) game.pass.shader.uniforms.uAmount.value += .0025
        else game.stop()
      } else if (game.camera.position.x === 1.5) {
        if (game.pass.shader.uniforms.uAmount.value > .75) game.pass.shader.uniforms.uAmount.value -= .0025
        else game.pass.shader.uniforms.uAmount.value = .75
      }
    } else if (mesh.octahedron.position.x === 1.5) {
      if (shader.sphereRight) shader.sphereRight.uniforms.uDistort.value = amplitude * 2

      if (game.camera.position.x === 1.5 && shader.sphereRight.uniforms.uDistort.value > .2) {
        if (game.pass.shader.uniforms.uAmount.value < 1) game.pass.shader.uniforms.uAmount.value += .0025
        else game.stop()
      } else if (game.camera.position.x === -1.5) {
        if (game.pass.shader.uniforms.uAmount.value > .75) game.pass.shader.uniforms.uAmount.value -= .0025
        else game.pass.shader.uniforms.uAmount.value = .75
      }
    } else {
      if (shader.sphereLeft && shader.sphereLeft.uniforms.uDistort.value > .1) shader.sphereLeft.uniforms.uDistort.value = .1
      if (shader.sphereRight && shader.sphereRight.uniforms.uDistort.value > .1) shader.sphereRight.uniforms.uDistort.value = .1
    }
    if (shader.cylinder) shader.cylinder.uniforms.uDistort.value = amplitude
    if (shader.octahedron) shader.octahedron.uniforms.uDistort.value = amplitude * 1.25
    if (shader.points) shader.points.uniforms.uDistort.value = amplitude

    if (game.camera.position.x !== 0) player.score += .01 // ? +- `.01`
  }

  if (shader.sphereLeft) shader.sphereLeft.uniforms.uTime.value = time
  if (shader.sphereRight) shader.sphereRight.uniforms.uTime.value = time
  if (shader.cylinder) shader.cylinder.uniforms.uTime.value = time
  if (shader.octahedron) shader.octahedron.uniforms.uTime.value = time
  if (shader.points) shader.points.uniforms.uTime.value = time
  if (shader.text) shader.text.uniforms.uTime.value = time

  game.pass.shader.uniforms.uTime.value = time
  game.composer.render()
}