let app,light,object,input;const getInt=(e,t)=>Math.floor(Math.random()*(t-e)+e),getColor=e=>{let t=10;switch(e){case"bright":t*=2;case"normal":t*=2;case"dark":t*=2}return`hsl(${getInt(0,360)}, ${getInt(0,101)}%, ${t}%)`};function init(){(app={renderer:null,camera:null,scene:null,composer:null,pass:null,time:null}).renderer=new THREE.WebGLRenderer({canvas:document.getElementsByTagName("canvas")[0]}),app.renderer.setPixelRatio(.2),app.renderer.setSize(window.innerWidth,window.innerHeight),app.renderer.setClearColor(getColor("bright")),app.renderer.shadowMap.enabled=!0,app.camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,1e3),app.camera.position.set(0,10,7.5),app.scene=new THREE.Scene,app.scene.add(app.camera),level(),post(),inter(),anim()}function level(){light={ambient:null,point:null};const e=getColor("bright");light.ambient=new THREE.AmbientLight(e,.5),app.scene.add(light.ambient),light.point=new THREE.PointLight(e,.5,100),light.point.position.set(5,5,5),light.point.castShadow=!0,light.point.shadow.mapSize=new THREE.Vector2(512,512),app.camera.add(light.point),(object={material:null,geometry:null,mesh:null}).material=[new THREE.MeshLambertMaterial({depthWrite:!1,transparent:!0,opacity:.75}),new THREE.MeshLambertMaterial({color:getColor("dark")}),new THREE.MeshLambertMaterial({color:getColor("bright")})],object.geometry=new THREE.Geometry,object.geometry.merge(new THREE.SphereGeometry(10,24,24)),object.geometry.faces.forEach((e,t)=>{e.materialIndex=t%2==0?1:2;let n=new THREE.SphereGeometry(1,2,2);if(n.lookAt(e.normal),n.translate(20*e.normal.x,20*e.normal.y,20*e.normal.z),object.geometry.merge(n),!getInt(0,5)){let t=new THREE.PlaneGeometry(2,1);t.rotateY(270*Math.PI/180),t.lookAt(e.normal),t.translate(11.125*e.normal.x,11.125*e.normal.y,11.125*e.normal.z),object.geometry.merge(t)}}),object.geometry.faces.forEach(e=>{e.materialIndex||(e.materialIndex=0)}),object.mesh=new THREE.Mesh(object.geometry,object.material),object.mesh.rotation.set(0,0,90*Math.PI/180),app.scene.add(object.mesh)}function post(){app.composer=new THREE.EffectComposer(app.renderer),app.composer.addPass(new THREE.RenderPass(app.scene,app.camera)),app.composer.addPass(app.pass=new THREE.Post),app.pass.renderToScreen=!0}function inter(){window.onorientationchange=(()=>location.reload()),window.onresize=(()=>{app.renderer.setSize(window.innerWidth,window.innerHeight),app.camera.aspect=window.innerWidth/window.innerHeight,app.camera.updateProjectionMatrix(),app.pass.setSize(window.innerWidth,window.innerHeight),app.composer.reset()}),(input={touch:{start:{x:null,y:null},end:{x:null,y:null}},isEnabled:null}).isEnabled=!0;const e=e=>{if(input.isEnabled)switch(input.isEnabled=!1,e){case"up":new TWEEN.Tween(app.camera.position).to({y:[12.5,10]},750).easing(TWEEN.Easing.Quadratic.Out).onComplete(()=>input.isEnabled=!0).start(),new TWEEN.Tween(app.camera.rotation).to({x:[-7.5*Math.PI/180,0]},750).easing(TWEEN.Easing.Quadratic.Out).start();break;case"left":new TWEEN.Tween(app.camera.position).to({x:-1.25},375).easing(TWEEN.Easing.Quadratic.Out).onComplete(()=>input.isEnabled=!0).start(),new TWEEN.Tween(app.camera.rotation).to({z:5*Math.PI/180},375).easing(TWEEN.Easing.Quadratic.Out).start();break;case"right":new TWEEN.Tween(app.camera.position).to({x:1.25},375).easing(TWEEN.Easing.Quadratic.Out).onComplete(()=>input.isEnabled=!0).start(),new TWEEN.Tween(app.camera.rotation).to({z:-5*Math.PI/180},375).easing(TWEEN.Easing.Quadratic.Out).start()}};window.ontouchstart=(e=>{input.touch.start.x=e.changedTouches[0].clientX/window.innerWidth*2-1,input.touch.start.y=e.changedTouches[0].clientY/window.innerHeight*-2+1}),window.ontouchend=(t=>{input.touch.end.x=t.changedTouches[0].clientX/window.innerWidth*2-1,input.touch.end.y=t.changedTouches[0].clientY/window.innerHeight*-2+1,input.touch.start.x-input.touch.end.x>.25?e("right"):input.touch.start.x-input.touch.end.x<-.25&&e("left"),input.touch.start.y-input.touch.end.y>.25?e("down"):input.touch.start.y-input.touch.end.y<-.25&&e("up")}),document.getElementsByTagName("canvas")[0].ontouchstart=(e=>e.preventDefault()),window.onkeydown=(t=>{switch(t.code){case"ArrowUp":case"KeyW":e("up");break;case"ArrowLeft":case"KeyA":e("left");break;case"ArrowRight":case"KeyD":e("right")}})}function anim(e){requestAnimationFrame(anim),TWEEN.update(),app.time=e/1e3,object.mesh.rotation.x=.25*app.time,app.pass.shaderMaterial.uniforms.uTime.value=app.time,app.composer.render()}