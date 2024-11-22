import * as THREE from "three";
import { OrbitControls, Wireframe } from "three/examples/jsm/Addons.js";
import * as dat from 'dat.gui'
import background from './imgs/background.jpg'
import block from './imgs/block.jpg'



const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
// scene
const scene = new THREE.Scene();

// Camera
// fov, projecttion value, near, far
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
// orbit control is for controlling the camera 
const orbit = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 2, 5);
orbit.update()

// enable shadows
renderer.shadowMap.enabled  = true


// axisHelp componenet
const axisHelper = new THREE.AxesHelper(15);
scene.add(axisHelper);

const boxGemorty = new THREE.BoxGeometry();
const boxMatrial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const box = new THREE.Mesh(boxGemorty, boxMatrial);

scene.add(box);


// gemtory plane
const gemotryPlan = new THREE.PlaneGeometry(30,30)
const gemotryMatrial = new THREE.MeshStandardMaterial({color:0xffffff,side:THREE.DoubleSide})
const plan = new THREE.Mesh(gemotryPlan,gemotryMatrial)
plan.rotateX(-0.5 * Math.PI)
plan.receiveShadow = true

scene.add(plan)

// setup helper to put grids
const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)


const sphereGeometry = new THREE.SphereGeometry(4,50,50)
const sphereMatrial = new THREE.MeshStandardMaterial({color:0xf42587});
const sphere = new THREE.Mesh(sphereGeometry,sphereMatrial)
sphere.position.set(-5,5,0)
sphere.castShadow = true
scene.add(sphere)

// ambientLight 
const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// // directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
scene.add(directionalLight)
directionalLight.position.set(-30,50,0)
directionalLight.castShadow = true
directionalLight.shadow.camera.bottom = -12

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(dLightHelper)

const dlightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dlightShadowHelper)



// Texture loader

const textureLoader = new THREE.TextureLoader()
scene.background = textureLoader.load(background)

const cubeTextureLoader = new THREE.CubeTextureLoader();

const boxGemorty2 = new THREE.BoxGeometry(4,4,4);
const boxMatrial2 = [
  new THREE.MeshStandardMaterial({ color: 0xffffff, map:textureLoader.load(block)}),
  new THREE.MeshStandardMaterial({ color: 0xffffff, map:textureLoader.load(block)}),
  new THREE.MeshStandardMaterial({ color: 0xffffff, map:textureLoader.load(block)}),
  new THREE.MeshStandardMaterial({ color: 0xffffff, map:textureLoader.load(block)}),
  new THREE.MeshStandardMaterial({ color: 0xffffff, map:textureLoader.load(block)}),
  new THREE.MeshStandardMaterial({ color: 0xffffff, map:textureLoader.load(block)}),


]
const box2 = new THREE.Mesh(boxGemorty2, boxMatrial2);
box2.position.set(2,5,5)
scene.add(box2);






const gui = new dat.GUI()
const options = {
  sphereColor : "#f47898",
  wireFrame:false
}

gui.addColor(options,'sphereColor').onChange((e)=>{
  sphere.material.color.set(e)
})
gui.add(options,'wireFrame').onChange((e)=>{
  sphere.material.wireframe = e
})

box2.name = "box2Name"
// mouse listener
const mousePos = new THREE.Vector2()
window.addEventListener("mousemove", (event)=>{
  mousePos.set(event.clientX/ window.innerWidth*2-1, event.clientY/ window.innerHeight*2-1)
})

const rayCaseter = new THREE.Raycaster()

const animate = (time:number) => {
  box.rotation.x =  (time/1000);



  rayCaseter.setFromCamera(mousePos,camera)

  const intersects = rayCaseter.intersectObjects(scene.children)
  console.log(intersects)
  for(let i=0; i<intersects.length; i++){
    if(intersects[i].object.id === sphere.id){
      sphere.material.color.set(0xff0022)
    }
    if(intersects[i].object.name === "box2Name"){
      intersects[i].object.rotateX(0.04)
    }
  }

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
