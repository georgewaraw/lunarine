let app,light,geometry,material,shader,mesh,input,player,audio;const getInt=(e,t)=>Math.floor(Math.random()*(t-e)+e),map=(e,t,a,n,o)=>(e-t)*(o-n)/(a-t)+n,getColor=e=>{let t=10;switch(e){case"bright":t*=2;case"normal":t*=2;case"dark":t*=2}return`hsl(${getInt(0,360)}, ${getInt(0,101)}%, ${t}%)`};function init(){(app={renderer:null,camera:null,scene:null,composer:null,pass:null,time:null,isEnabled:null}).renderer=new THREE.WebGLRenderer({canvas:document.getElementsByTagName("canvas")[0]}),app.renderer.setPixelRatio(.2),app.renderer.setSize(window.innerWidth,window.innerHeight);const e=getColor("bright");app.renderer.setClearColor(e),app.renderer.shadowMap.enabled=!0,app.camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,1e3),app.camera.position.set(0,10,7.5),app.scene=new THREE.Scene,app.scene.fog=new THREE.FogExp2(e,.075),app.scene.add(app.camera),level(),post(),inter(),anim()}function level(){light={ambient:null,point:null};let e=getColor("bright");light.ambient=new THREE.AmbientLight(e,.5),app.scene.add(light.ambient),light.point=new THREE.PointLight(e,.5,100),light.point.position.set(5,5,5),light.point.castShadow=!0,light.point.shadow.mapSize=new THREE.Vector2(512,512),app.camera.add(light.point),material={planet:null,tree:null,obstacle:null,snow:null,title:null},shader={planet:null,tree:null,obstacle:null,snow:null,title:null},mesh={planet:null,tree:null,obstacle:null,snow:null,title:null};const t="\n    uniform float uTime;\n    uniform float uMorph;\n    uniform float uDistort;\n  ",a="\n    vec3 transformed = vec3(position);\n\n    transformed.x += sin((position.x + uTime * .375) * 20.) * .0015 * uMorph;\n    transformed.y += sin((position.y + uTime * .375) * 20.) * .0015 * uMorph;\n    transformed.z += sin((position.z + uTime * .375) * 20.) * .0015 * uMorph;\n\n    if (uDistort > 0.) {\n      transformed.x += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;\n      transformed.y += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;\n      transformed.z += fract(sin(dot(position.x + uTime * .00000025, (12.9898, 78.233))) * 43758.5453123) * uDistort;\n    }\n  ";(geometry={planet:null,tree:null,obstacle:null,snow:null,title:null}).planet=new THREE.SphereGeometry(10,24,24);const n=new THREE.Color(getColor("dark")),o=new THREE.Color(getColor("bright"));geometry.planet.faces.forEach((e,t)=>e.color=t%2?n:o),material.planet=new THREE.MeshLambertMaterial({transparent:!0,opacity:.25,vertexColors:THREE.FaceColors}),material.planet.onBeforeCompile=(e=>{shader.planet=e,e.uniforms.uTime={value:0},e.uniforms.uMorph={value:10},e.uniforms.uDistort={value:1},e.vertexShader=t+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",a)}),mesh.planet=new THREE.Mesh(geometry.planet,material.planet),mesh.planet.receiveShadow=!0,mesh.planet.rotation.set(0,0,90*Math.PI/180),app.scene.add(mesh.planet),geometry.tree=new THREE.Geometry,geometry.planet.faces.forEach((e,t)=>{if(!(t%20)){let t=new THREE.CylinderGeometry(0,.25,5);t.rotateX(90*Math.PI/180),t.lookAt(e.normal),t.translate(10*e.normal.x,10*e.normal.y,10*e.normal.z),geometry.tree.merge(t)}}),material.tree=new THREE.MeshLambertMaterial({side:THREE.DoubleSide,depthWrite:!1,transparent:!0,opacity:.25,color:getColor("bright")}),material.tree.onBeforeCompile=(e=>{shader.tree=e,e.uniforms.uTime={value:0},e.uniforms.uMorph={value:10},e.uniforms.uDistort={value:1},e.vertexShader=t+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",a)}),mesh.tree=new THREE.Mesh(geometry.tree,material.tree),mesh.tree.castShadow=!0,app.scene.add(mesh.tree),geometry.obstacle=new THREE.CylinderBufferGeometry(0,.25,1),material.obstacle=new THREE.MeshLambertMaterial({transparent:!0,opacity:.5,color:getColor("bright")}),material.obstacle.onBeforeCompile=(e=>{shader.obstacle=e,e.uniforms.uTime={value:0},e.uniforms.uMorph={value:30},e.uniforms.uDistort={value:0},e.vertexShader=t+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",a)}),mesh.obstacle=new THREE.Mesh(geometry.obstacle,material.obstacle),mesh.obstacle.castShadow=!0,mesh.obstacle.position.set(app.camera.position.x-.5,app.camera.position.y+.75,app.camera.position.z-30),mesh.obstacle.rotation.set(90*Math.PI/180,0,0),geometry.snow=new THREE.Geometry;for(let e=1e3;e--;)geometry.snow.vertices.push(new THREE.Vector3(Math.random(),Math.random(),Math.random()));material.snow=new THREE.PointsMaterial({size:.01,transparent:!0,opacity:.25,depthWrite:!1,color:getColor("normal")}),material.snow.onBeforeCompile=(e=>{shader.snow=e,e.uniforms.uTime={value:0},e.uniforms.uMorph={value:10},e.uniforms.uDistort={value:1},e.vertexShader=t+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",a)}),mesh.snow=new THREE.Points(geometry.snow,material.snow),mesh.snow.position.set(app.camera.position.x-.5,app.camera.position.y-.5,app.camera.position.z-1),app.scene.add(mesh.snow),(new THREE.FontLoader).load("json/VT323_Regular.json",e=>{geometry.title=new THREE.TextBufferGeometry(" waraws\nLUNARINE",{font:e,size:.1,height:.01}),material.title=new THREE.MeshLambertMaterial({transparent:!0,opacity:.75,color:getColor("dark")}),material.title.onBeforeCompile=(e=>{shader.title=e,e.uniforms.uTime={value:0},e.uniforms.uMorph={value:.75},e.uniforms.uDistort={value:.001},e.vertexShader=t+e.vertexShader,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",a)}),mesh.title=new THREE.Mesh(geometry.title,material.title),mesh.title.position.set(app.camera.position.x-.225,app.camera.position.y+.1,app.camera.position.z-1.25),app.scene.add(mesh.title)})}function post(){app.composer=new THREE.EffectComposer(app.renderer),app.composer.addPass(new THREE.RenderPass(app.scene,app.camera)),app.composer.addPass(app.pass=new THREE.Post),app.pass.renderToScreen=!0}function sound(){(audio={listener:null,loader:null,sample:null,analyser:null,amplitude:null}).listener=new THREE.AudioListener,app.camera.add(audio.listener),audio.loader=new THREE.AudioLoader,audio.sample=new THREE.Audio(audio.listener),audio.loader.load("mp3/audio.mp3",e=>{audio.sample.setBuffer(e),audio.sample.setLoop(!0),audio.sample.play()}),audio.analyser=new THREE.AudioAnalyser(audio.sample)}function inter(){window.onorientationchange=(()=>location.reload()),window.onresize=(()=>{app.renderer.setSize(window.innerWidth,window.innerHeight),app.camera.aspect=window.innerWidth/window.innerHeight,app.camera.updateProjectionMatrix(),app.pass.setSize(window.innerWidth,window.innerHeight),app.composer.reset()}),input={touch:{start:{x:null,y:null},end:{x:null,y:null}}},player={isFacing:null,isMoving:null};const e=e=>{switch(e){case"move":player.isMoving=!0;break;case"turn":player.isFacing+=90*Math.PI/180}app.isEnabled||(app.isEnabled=!0,sound(),app.scene.remove(mesh.title),material.planet.opacity=.75,material.tree.opacity=.75,app.scene.add(mesh.obstacle))};window.ontouchstart=(t=>{input.touch.start.x=t.changedTouches[0].clientX/window.innerWidth*2-1,input.touch.start.y=t.changedTouches[0].clientY/window.innerHeight*-2+1,e("move")}),window.ontouchend=(t=>{input.touch.end.x=t.changedTouches[0].clientX/window.innerWidth*2-1,input.touch.end.y=t.changedTouches[0].clientY/window.innerHeight*-2+1,player.isMoving=!1,Math.abs(input.touch.start.x-input.touch.end.x)<.25&&input.touch.start.y-input.touch.end.y>.25&&e("turn")}),document.getElementsByTagName("canvas")[0].ontouchstart=(e=>e.preventDefault()),window.onkeydown=(t=>{switch(t.code){case"ArrowUp":case"KeyW":e("move");break;case"ArrowDown":case"KeyS":e("turn")}}),window.onkeyup=(e=>{"ArrowUp"!==e.code&&"KeyW"!==e.code||(player.isMoving=!1)})}function anim(e){requestAnimationFrame(anim),app.time=e/1e3,app.isEnabled&&(mesh.planet.rotation.x+=.0075,mesh.tree.rotation.x+=.0075,mesh.obstacle.position.x=Math.cos(1.75*app.time),mesh.obstacle.position.y=app.camera.position.y+.75+Math.sin(1.5*app.time)/2,mesh.obstacle.position.z+=.075,mesh.obstacle.position.z>app.camera.position.z&&(mesh.obstacle.position.z=app.camera.position.z-30)),player.isMoving&&(mesh.planet.rotation.x+=.01,mesh.tree.rotation.x+=.01),mesh.planet.rotation.y<player.isFacing?(mesh.planet.rotation.y+=.1,mesh.tree.rotation.y+=.1):(mesh.planet.rotation.y=player.isFacing,mesh.tree.rotation.y=player.isFacing),Object.keys(shader).forEach(e=>{shader[e]&&(shader[e].uniforms.uTime.value=app.time)}),app.isEnabled&&(audio.amplitude=map(audio.analyser.getFrequencyData()[0],0,255,.1,2),shader.planet.uniforms.uDistort.value=audio.amplitude,shader.tree.uniforms.uDistort.value=audio.amplitude,shader.obstacle&&(shader.obstacle.uniforms.uDistort.value=audio.amplitude),shader.snow.uniforms.uDistort.value=audio.amplitude),app.pass.shaderMaterial.uniforms.uTime.value=app.time,app.composer.render()}