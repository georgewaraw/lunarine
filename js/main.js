const getNumber=(e,t)=>Math.floor(Math.random()*(t-e)+e),mapNumber=(e,t,r,s,a)=>(e-t)*(a-s)/(r-t)+s,getColor=e=>{let t=40;return"dark"===e?t/=2:"light"===e&&(t*=2),`hsl(${getNumber(0,360)}, ${getNumber(0,101)}%, ${t}%)`};function Game(){const e=getColor("light"),t=new THREE.WebGLRenderer({canvas:document.getElementsByTagName("canvas")[0]});t.setPixelRatio(.2),t.setSize(window.innerWidth,window.innerHeight),t.setClearColor(e),t.shadowMap.enabled=!0,this.scene=new THREE.Scene,this.scene.fog=new THREE.FogExp2(e,.075),this.camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(0,10,7.5),this.pass=new THREE.Post,this.pass.renderToScreen=!0,this.composer=new THREE.EffectComposer(t),this.composer.addPass(new THREE.RenderPass(this.scene,this.camera)),this.composer.addPass(this.pass),window.onresize=(()=>{t.setPixelRatio(.2),t.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.pass.setSize(window.innerWidth,window.innerHeight),this.composer.reset()}),window.onorientationchange=(()=>location.reload());const r=new THREE.AmbientLight(e,.5);this.scene.add(r);const s=new THREE.PointLight(e,.5,100);s.shadow.mapSize=new THREE.Vector2(512,512),s.castShadow=!0,s.position.set(5,15,10),this.scene.add(s),this.state="",this.start=(()=>{audio=new Audio,this.state="started",material.sphereLeft.opacity=1,material.sphereRight.opacity=1,material.cylinder.opacity=.75,this.scene.remove(textTitle),this.scene.add(mesh.octahedron),new TWEEN.Tween(mesh.octahedron.position).to({y:[12,13,12.5]},1e4).repeat(1/0).start();const e=new TWEEN.Tween(mesh.octahedron.position).to({x:-1.5},500).easing(TWEEN.Easing.Quadratic.In),t=new TWEEN.Tween(mesh.octahedron.position).to({x:1.5},500).easing(TWEEN.Easing.Quadratic.In);setInterval(()=>{getNumber(0,2)&&(1.5===mesh.octahedron.position.x?e.start():-1.5===mesh.octahedron.position.x&&t.start())},1e3)}),this.stop=(()=>{this.state="stopped",this.camera.position.x=0,this.pass.shader.uniforms.uAmount.value=.75,material.sphereLeft.opacity=.25,material.sphereRight.opacity=.25,material.cylinder.opacity=.25,shader.cylinder.uniforms.uDistort.value=.75,this.scene.remove(mesh.octahedron),(new THREE.FontLoader).load("json/VT323_Regular.json",e=>{const t=new THREE.Mesh(new THREE.TextBufferGeometry(`SCORE\n${("00000"+Math.round(player.score)).slice(-5)}`,{font:e,size:.1,height:.01}),material.text);t.position.set(-.1375,10.1,6.25),game.scene.add(t)})})}function Geometry(){const e=new THREE.Color(getColor("dark")),t=new THREE.Color(getColor("light"));this.sphereLeft=new THREE.SphereGeometry(10,24,24),this.sphereRight=this.sphereLeft.clone(),this.sphereLeft.vertices.forEach(e=>e.y=Math.max(e.y,0)),this.sphereRight.vertices.forEach(e=>e.y=Math.min(e.y,0)),this.sphereLeft.faces.forEach((r,s)=>r.color=s%2?e:t),this.sphereRight.faces.forEach((r,s)=>r.color=s%2?e:t),this.cylinder=new THREE.Geometry,this.sphereLeft.faces.forEach((e,t)=>{if(!(t%20)){const t=new THREE.CylinderGeometry(0,.25,5);t.rotateX(90*Math.PI/180),t.lookAt(e.normal),t.translate(10*e.normal.x,10*e.normal.y,10*e.normal.z),this.cylinder.merge(t)}}),this.octahedron=new THREE.OctahedronBufferGeometry(1),this.points=new THREE.Geometry;for(let e=1e3;e--;)this.points.vertices.push(new THREE.Vector3(Math.random(),Math.random(),Math.random()))}function Material(){const e=getColor("light");this.sphereLeft=new THREE.MeshLambertMaterial({transparent:!0,opacity:.25,vertexColors:THREE.FaceColors}),this.sphereRight=this.sphereLeft.clone(),this.cylinder=new THREE.MeshLambertMaterial({depthWrite:!1,side:THREE.DoubleSide,transparent:!0,opacity:.25,color:e}),this.octahedron=new THREE.MeshLambertMaterial({transparent:!0,opacity:.75,color:e}),this.points=new THREE.PointsMaterial({depthWrite:!1,size:.01,transparent:!0,opacity:.25,color:getColor()}),this.text=new THREE.MeshLambertMaterial({transparent:!0,opacity:.75,color:getColor("dark")})}function Shader(){const e="\n    uniform float uTime;\n    uniform float uMorph;\n    uniform float uDistort;\n  ",t="\n    vec3 transformed = vec3(position);\n\n    transformed.x += sin((position.x + uTime * .375) * 20.) * .0015 * uMorph;\n    transformed.y += sin((position.y + uTime * .375) * 20.) * .0015 * uMorph;\n    transformed.z += sin((position.z + uTime * .375) * 20.) * .0015 * uMorph;\n\n    if (uDistort > 0.) {\n      transformed.x += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;\n      transformed.y += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;\n      transformed.z += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;\n    }\n  ";material.sphereLeft.onBeforeCompile=(r=>{this.sphereLeft=r,r.uniforms.uTime={value:0},r.uniforms.uMorph={value:10},r.uniforms.uDistort={value:.1},r.vertexShader=e+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",t.substring(0,t.indexOf(";")+1)+"\n      transformed.y *= 2.;\n    "+t.substring(t.indexOf(";")+1))}),material.sphereRight.onBeforeCompile=(r=>{this.sphereRight=r,r.uniforms.uTime={value:0},r.uniforms.uMorph={value:10},r.uniforms.uDistort={value:.1},r.vertexShader=e+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",t.substring(0,t.indexOf(";")+1)+"\n      transformed.y *= 2.;\n    "+t.substring(t.indexOf(";")+1))}),material.cylinder.onBeforeCompile=(r=>{this.cylinder=r,r.uniforms.uTime={value:0},r.uniforms.uMorph={value:10},r.uniforms.uDistort={value:.75},r.vertexShader=e+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",t)}),material.octahedron.onBeforeCompile=(r=>{this.octahedron=r,r.uniforms.uTime={value:0},r.uniforms.uMorph={value:20},r.uniforms.uDistort={value:.1},r.vertexShader=e+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",t.substring(0,t.indexOf(";")+1)+"\n      transformed.x *= .75;\n      transformed.y *= 1.5;\n      transformed.z *= .75;\n    "+t.substring(t.indexOf(";")+1))}),material.points.onBeforeCompile=(r=>{this.points=r,r.uniforms.uTime={value:0},r.uniforms.uMorph={value:10},r.uniforms.uDistort={value:.75},r.vertexShader=e+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",t)}),material.text.onBeforeCompile=(r=>{this.text=r,r.uniforms.uTime={value:0},r.uniforms.uMorph={value:.75},r.uniforms.uDistort={value:.001},r.vertexShader=e+r.vertexShader,r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",t)})}function Mesh(){this.sphereLeft=new THREE.Mesh(geometry.sphereLeft,material.sphereLeft),this.sphereLeft.receiveShadow=!0,this.sphereLeft.rotation.set(0,0,90*Math.PI/180),game.scene.add(this.sphereLeft),this.sphereRight=new THREE.Mesh(geometry.sphereRight,material.sphereRight),this.sphereRight.receiveShadow=!0,this.sphereRight.rotation.set(0,0,90*Math.PI/180),game.scene.add(this.sphereRight),this.cylinder=new THREE.Mesh(geometry.cylinder,material.cylinder),this.cylinder.castShadow=!0,game.scene.add(this.cylinder),this.octahedron=new THREE.Mesh(geometry.octahedron,material.octahedron),this.octahedron.position.set(-1.5,12.5,-12.5),this.points=new THREE.Points(geometry.points,material.points),game.scene.add(this.points)}function Player(){let e=!1;const t=new TWEEN.Tween(game.camera.position).to({x:-1.5},250).easing(TWEEN.Easing.Quadratic.Out).onComplete(()=>e=!1),r=new TWEEN.Tween(game.camera.position).to({x:1.5},250).easing(TWEEN.Easing.Quadratic.Out).onComplete(()=>e=!1),s=s=>{e||("left"===s&&game.camera.position.x>=0?(e=!0,t.start()):"right"===s&&game.camera.position.x<=0&&(e=!0,r.start()))};let a,o;window.onkeydown=(e=>{switch(game.state){case"started":switch(e.code){case"ArrowLeft":case"KeyA":s("left");break;case"ArrowRight":case"KeyD":s("right")}break;case"stopped":location.reload();break;default:game.start()}}),window.ontouchstart=(e=>{a=e.changedTouches[0].clientX/window.innerWidth*2-1,o=e.changedTouches[0].clientY/window.innerHeight*-2+1}),window.ontouchend=(e=>{const t=e.changedTouches[0].clientX/window.innerWidth*2-1,r=e.changedTouches[0].clientY/window.innerHeight*-2+1;switch(game.state){case"started":Math.abs(o-r)<.25&&a-t<-.25?s("left"):Math.abs(o-r)<.25&&a-t>.25&&s("right");break;case"stopped":location.reload();break;default:game.start()}}),document.getElementsByTagName("canvas")[0].ontouchstart=(e=>e.preventDefault()),this.score=0}function Audio(){const e=new THREE.AudioListener;game.camera.add(e);const t=new THREE.AudioLoader,r=new THREE.Audio(e);t.load("mp3/audio.mp3",e=>{r.setBuffer(e),r.setLoop(!0),r.play()}),this.analyser=new THREE.AudioAnalyser(r),window.onblur=(()=>r.setVolume(0)),window.onfocus=(()=>r.setVolume(1))}function setup(){game=new Game,geometry=new Geometry,material=new Material,shader=new Shader,mesh=new Mesh,player=new Player,(new THREE.FontLoader).load("json/VT323_Regular.json",e=>{textTitle=new THREE.Mesh(new THREE.TextBufferGeometry(" waraws\nLUNARINE",{font:e,size:.1,height:.01}),material.text),textTitle.position.set(-.225,10.1,6.25),game.scene.add(textTitle)}),draw()}function draw(e){requestAnimationFrame(draw),TWEEN.update();const t=e/1e3;if(mesh.points.position.set(game.camera.position.x-.5,game.camera.position.y-.5,6.5),"started"===game.state){mesh.sphereLeft.rotation.x=t/2,mesh.sphereRight.rotation.x=t/2,mesh.cylinder.rotation.x=t/2,mesh.octahedron.rotation.y=t/2;const e=mapNumber(audio.analyser.getAverageFrequency(),63,255,.1,3);-1.5===mesh.octahedron.position.x?(shader.sphereLeft&&(shader.sphereLeft.uniforms.uDistort.value=2*e),-1.5===game.camera.position.x&&shader.sphereLeft.uniforms.uDistort.value>.2?game.pass.shader.uniforms.uAmount.value<1?(game.pass.shader.uniforms.uAmount.value+=.005,player.score+=.5):game.stop():1.5===game.camera.position.x&&(game.pass.shader.uniforms.uAmount.value>.75?game.pass.shader.uniforms.uAmount.value-=.005:game.pass.shader.uniforms.uAmount.value=.75)):1.5===mesh.octahedron.position.x?(shader.sphereRight&&(shader.sphereRight.uniforms.uDistort.value=2*e),1.5===game.camera.position.x&&shader.sphereRight.uniforms.uDistort.value>.2?game.pass.shader.uniforms.uAmount.value<1?(game.pass.shader.uniforms.uAmount.value+=.005,player.score+=.5):game.stop():-1.5===game.camera.position.x&&(game.pass.shader.uniforms.uAmount.value>.75?game.pass.shader.uniforms.uAmount.value-=.005:game.pass.shader.uniforms.uAmount.value=.75)):(shader.sphereLeft&&shader.sphereLeft.uniforms.uDistort.value>.1&&(shader.sphereLeft.uniforms.uDistort.value=.1),shader.sphereRight&&shader.sphereRight.uniforms.uDistort.value>.1&&(shader.sphereRight.uniforms.uDistort.value=.1)),shader.cylinder&&(shader.cylinder.uniforms.uDistort.value=e),shader.octahedron&&(shader.octahedron.uniforms.uDistort.value=1.25*e),shader.points&&(shader.points.uniforms.uDistort.value=e)}shader.sphereLeft&&(shader.sphereLeft.uniforms.uTime.value=t),shader.sphereRight&&(shader.sphereRight.uniforms.uTime.value=t),shader.cylinder&&(shader.cylinder.uniforms.uTime.value=t),shader.octahedron&&(shader.octahedron.uniforms.uTime.value=t),shader.points&&(shader.points.uniforms.uTime.value=t),shader.text&&(shader.text.uniforms.uTime.value=t),game.pass.shader.uniforms.uTime.value=t,game.composer.render()}