// 高中常見有機化合物資料
const compounds = [
  // 烷
  { name: "甲烷", empirical: "CH4", molecular: "CH4", structural: "CH4", condensed: "CH4", model: [{atom:'C',x:0,y:0,z:0,children:[{atom:'H',x:1,y:0,z:0},{atom:'H',x:-1,y:0,z:0},{atom:'H',x:0,y:1,z:0},{atom:'H',x:0,y:-1,z:0}]}] },
  { name: "乙烷", empirical: "C2H6", molecular: "C2H6", structural: "CH3-CH3", condensed: "CH3CH3", model: [{atom:'C',x:0,y:0,z:0,children:[{atom:'H',x:1,y:0,z:0},{atom:'H',x:0,y:1,z:0},{atom:'H',x:0,z:1,y:0},{atom:'C',x:-1,y:0,z:0,children:[{atom:'H',x:-2,y:0,z:0},{atom:'H',x:-1,y:1,z:0},{atom:'H',x:-1,y:0,z:1}]}]}] },
  // 烯
  { name: "乙烯", empirical: "C2H4", molecular: "C2H4", structural: "H2C=CH2", condensed: "C2H4", model: [] },
  // 炔
  { name: "乙炔", empirical: "C2H2", molecular: "C2H2", structural: "HC≡CH", condensed: "C2H2", model: [] },
  // 醇
  { name: "甲醇", empirical: "CH4O", molecular: "CH3OH", structural: "CH3-OH", condensed: "CH3OH", model: [] },
  { name: "乙醇", empirical: "C2H6O", molecular: "C2H5OH", structural: "CH3CH2-OH", condensed: "C2H5OH", model: [] },
  // 醚
  { name: "甲醚", empirical: "C2H6O", molecular: "CH3OCH3", structural: "CH3-O-CH3", condensed: "CH3OCH3", model: [] },
  { name: "乙醚", empirical: "C4H10O", molecular: "C2H5OC2H5", structural: "CH3CH2-O-CH2CH3", condensed: "C2H5OC2H5", model: [] },
  { name: "甲乙醚", empirical: "C3H8O", molecular: "CH3OC2H5", structural: "CH3-O-CH2CH3", condensed: "CH3OC2H5", model: [] },
  // 其他化合物可以依此格式添加...
];

// 初始化選單
const select = document.getElementById('compoundSelect');
compounds.forEach(c => {
  const option = document.createElement('option');
  option.value = c.name;
  option.textContent = c.name;
  select.appendChild(option);
});

// Three.js 初始化
const viewer = document.getElementById('viewer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const camera = new THREE.PerspectiveCamera(75, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
camera.position.set(5,5,5);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10,10,10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// 原子顏色
const atomColors = {H:0xffffff, C:0x000000, O:0xff0000, N:0x0000ff, Cl:0x00ff00};

function clearScene() {
  for(let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    if(obj.type !== "AmbientLight" && obj.type !== "DirectionalLight") scene.remove(obj);
  }
}

function addAtom(atom, x=0,y=0,z=0, radius=0.3) {
  const geometry = new THREE.SphereGeometry(radius,32,32);
  const material = new THREE.MeshPhongMaterial({color:atomColors[atom] || 0x888888});
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x,y,z);
  scene.add(sphere);
  return sphere;
}

function addBond(pos1,pos2) {
  const distance = pos1.distanceTo(pos2);
  const mid = new THREE.Vector3().addVectors(pos1,pos2).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(pos2,pos1);
  const orientation = new THREE.Matrix4();
  orientation.lookAt(pos1,pos2,new THREE.Object3D().up);
  orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI/2));

  const geometry = new THREE.CylinderGeometry(0.1,0.1,distance,16);
  const material = new THREE.MeshPhongMaterial({color:0xaaaaaa});
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.applyMatrix4(orientation);
  cylinder.position.copy(mid);
  scene.add(cylinder);
}

// 將模型加入場景
function loadModel(model) {
  clearScene();
  if(!model || model.length===0) return;

  const spheres = [];
  function recursiveAdd(atomObj, parentPos=null) {
    const x = atomObj.x || 0;
    const y = atomObj.y || 0;
    const z = atomObj.z || 0;
    const sphere = addAtom(atomObj.atom, x, y, z);
    spheres.push({mesh:sphere, pos:new THREE.Vector3(x,y,z)});
    if(parentPos) addBond(parentPos,new THREE.Vector3(x,y,z));
    if(atomObj.children) {
      atomObj.children.forEach(child => recursiveAdd(child,new THREE.Vector3(x,y,z)));
    }
  }
  model.forEach(atomObj => recursiveAdd(atomObj,null));
}

// 選擇化合物
select.addEventListener('change',()=>{
  const compound = compounds.find(c=>c.name===select.value);
  if(!compound) return;
  document.getElementById('empiricalFormula').textContent = compound.empirical;
  document.getElementById('molecularFormula').textContent = compound.molecular;
  document.getElementById('structuralFormula').textContent = compound.structural;
  document.getElementById('condensedFormula').textContent = compound.condensed;
  loadModel(compound.model);
});

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
animate();
