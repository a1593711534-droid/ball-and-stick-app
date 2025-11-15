// 基本設定
const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(5, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 原子顏色對照表
const atomColors = {
  H: 0xffffff,  // 氫
  C: 0x000000,  // 碳
  O: 0xff0000,  // 氧
  N: 0x0000ff,  // 氮
  S: 0xffff00,  // 硫
};

// 範例分子資料：水 H2O
const molecule = [
  { element: 'O', position: [0, 0, 0] },
  { element: 'H', position: [0.96, 0, 0] },
  { element: 'H', position: [-0.24, 0.93, 0] }
];

// 原子半徑
const atomRadius = {
  H: 0.2,
  C: 0.3,
  O: 0.3,
  N: 0.3,
  S: 0.35,
};

// 建立球棒模型
function addAtom(atom) {
  const geometry = new THREE.SphereGeometry(atomRadius[atom.element], 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: atomColors[atom.element] });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(...atom.position);
  scene.add(sphere);
  return sphere;
}

function addBond(atom1, atom2) {
  const start = new THREE.Vector3(...atom1.position);
  const end = new THREE.Vector3(...atom2.position);
  const bondLength = start.distanceTo(end);
  const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, bondLength, 16);
  const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const bond = new THREE.Mesh(bondGeometry, bondMaterial);

  // 定位與旋轉
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  bond.position.copy(mid);
  bond.lookAt(end);
  bond.rotateX(Math.PI / 2);

  scene.add(bond);
}

// 建立分子
const atoms = molecule.map(addAtom);
for (let i = 0; i < atoms.length; i++) {
  for (let j = i + 1; j < atoms.length; j++) {
    addBond(molecule[i], molecule[j]);
  }
}

// 自適應視窗
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// 渲染迴圈
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
