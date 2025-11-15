let scene, camera, renderer, controls;
let atoms = [];
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

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x888888));

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.getElementById('add-atom').addEventListener('click', () => {
    const element = document.getElementById('atom-select').value;
    addAtom(element);
  });
}

function addAtom(element) {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({color: atomColors[element]});
  const sphere = new THREE.Mesh(geometry, material);

  // 放在場景中心附近，確保看得見
  sphere.position.set(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2);
  scene.add(sphere);

  atoms.push({id: atomId++, element, mesh: sphere});
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
