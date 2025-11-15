let scene, camera, renderer, controls;
let atoms = [];
let bonds = [];
let atomId = 0;

const atomColors = {
  C: 0x222222,
  H: 0xffffff,
  O: 0xff0000,
  N: 0x0000ff,
  Cl: 0x00ff00
};

init();
animate();

function init() {
  const container = document.getElementById('canvas-container');
  
  // 場景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 相機
  camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 50);

  // 光源
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x888888));

  // 渲染器
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // 加原子按鈕
  document.getElementById('add-atom').addEventListener('click', () => {
    const element = document.getElementById('atom-select').value;
    addAtom(element);
  });
}

// 添加原子
function addAtom(element) {
  const sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({color: atomColors[element]});
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // 初始位置：隨機
  sphere.position.set(Math.random()*10-5, Math.random()*10-5, Math.random()*10-5);
  scene.add(sphere);

  atoms.push({id: atomId++, element, mesh: sphere, bonds: {left: null, right: null}});
  updateBonds();
}

// 更新化學鍵
function updateBonds() {
  // 先移除舊的
  bonds.forEach(b => scene.remove(b.mesh));
  bonds = [];

  atoms.forEach(atom => {
    ['left','right'].forEach(side => {
      const target = atom.bonds[side];
      if(target != null) {
        const from = atom.mesh.position;
        const to = atoms.find(a=>a.id===target).mesh.position;

        const dir = new THREE.Vector3().subVectors(to, from);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);

        const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, len, 16);
        const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        // 將圓柱沿著兩點方向旋轉
        cylinder.position.copy(mid);
        cylinder.lookAt(to);
        cylinder.rotateX(Math.PI/2);

        scene.add(cylinder);
        bonds.push({mesh: cylinder, from: atom.id, to: target});
      }
    });
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
