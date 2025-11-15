// 取得容器
const container = document.getElementById('container');

// 建立場景、相機、渲染器
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
container.appendChild(renderer.domElement);

// 控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// 光源
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10,10,10);
scene.add(directionalLight);

// 範例分子：H2O
const atoms = [
  {element:'O', x:0, y:0, z:0, color:0xff0000},
  {element:'H', x:1, y:0, z:0, color:0xffffff},
  {element:'H', x:-1, y:0, z:0, color:0xffffff}
];

const bonds = [
  {start:0, end:1},
  {start:0, end:2}
];

// 繪製原子
atoms.forEach(atom => {
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const material = new THREE.MeshStandardMaterial({color: atom.color});
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(atom.x, atom.y, atom.z);
  scene.add(sphere);
});

// 繪製鍵
bonds.forEach(bond => {
  const start = atoms[bond.start];
  const end = atoms[bond.end];
  const material = new THREE.MeshStandardMaterial({color:0x000000});
  const cylinderGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
  const cylinder = new THREE.Mesh(cylinderGeom, material);

  // 計算位置與方向
  const startVec = new THREE.Vector3(start.x, start.y, start.z);
  const endVec = new THREE.Vector3(end.x, end.y, end.z);
  const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  cylinder.position.copy(mid);

  const diff = new THREE.Vector3().subVectors(endVec, startVec);
  const length = diff.length();
  cylinder.scale.set(1, length, 1);
  cylinder.lookAt(endVec);
  cylinder.rotateX(Math.PI / 2);

  scene.add(cylinder);
});

// 動畫
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();
