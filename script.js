// 建立場景、攝影機、渲染器
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth-250)/window.innerHeight, 0.1, 1000);
camera.position.set(5,5,10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth-250, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// 控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// 燈光
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(10,10,10);
scene.add(light1);
scene.add(new THREE.AmbientLight(0x888888));

// 原子資料
const atoms = [];
const bonds = [];
const atomRadius = 0.3;
const bondRadius = 0.1;
const atomColors = { C:0x000000, H:0xffffff, O:0xff0000, N:0x0000ff, Cl:0x00ff00 };

// 新增原子
function addAtom(element){
    const geometry = new THREE.SphereGeometry(atomRadius,32,32);
    const material = new THREE.MeshPhongMaterial({ color: atomColors[element] });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(atoms.length*2,0,0); // 每個新原子 X 軸間隔 2
    scene.add(sphere);
    atoms.push({ element, mesh: sphere });
}

// 新增化學鍵
function addBond(a1, a2, order=1){
    const start = a1.mesh.position.clone();
    const end = a2.mesh.position.clone();
    const dir = new THREE.Vector3().subVectors(end, start);
    const distance = dir.length();
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    for(let i=0;i<order;i++){
        const offset = (i-(order-1)/2)*0.15;
        const geometry = new THREE.CylinderGeometry(bondRadius,bondRadius,distance,16);
        const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.copy(midpoint);
        cylinder.lookAt(end);
        cylinder.rotateX(Math.PI/2);
        cylinder.position.add(new THREE.Vector3(0,offset,0));
        scene.add(cylinder);
        bonds.push(cylinder);
    }
}

// DOM事件
document.getElementById('add-atom').addEventListener('click',()=>{
    const el = document.getElementById('element-select').value;
    addAtom(el);
});

document.getElementById('connect-bond').addEventListener('click',()=>{
    if(atoms.length<2) return alert('至少兩個原子才能連接');
    const left = parseInt(document.getElementById('left-bond').value);
    const right = parseInt(document.getElementById('right-bond').value);
    const angle = parseFloat(document.getElementById('bond-angle').value);
    const a1 = atoms[atoms.length-2];
    const a2 = atoms[atoms.length-1];
    if(left>0) addBond(a2,a1,left);
    if(right>0) addBond(a1,a2,right);
});

// 渲染
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}
animate();

// 視窗大小
window.addEventListener('resize',()=>{
    camera.aspect = (window.innerWidth-250)/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth-250, window.innerHeight);
});
