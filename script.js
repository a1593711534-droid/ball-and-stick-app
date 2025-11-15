// 基本場景設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5,5,10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth - 250, window.innerHeight); // 留下 controls 寬度
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// 燈光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10,10,10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 原子與鍵資料
const atoms = [];
const bonds = [];
const atomRadius = 0.3;
const bondRadius = 0.1;

// 原子顏色對照
const atomColors = { C:0x000000, H:0xffffff, O:0xff0000, N:0x0000ff, Cl:0x00ff00 };

// 加原子函數
function addAtom(element) {
    const geometry = new THREE.SphereGeometry(atomRadius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: atomColors[element] || 0x888888 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(atoms.length*1.5, 0, 0);
    scene.add(sphere);
    atoms.push({ element, mesh: sphere });
}

// 加鍵函數
function addBond(atom1, atom2, order=1) {
    const dir = new THREE.Vector3().subVectors(atom2.mesh.position, atom1.mesh.position);
    const distance = dir.length();
    dir.normalize();
    const midpoint = new THREE.Vector3().addVectors(atom1.mesh.position, atom2.mesh.position).multiplyScalar(0.5);

    for(let i=0;i<order;i++){
        const angleOffset = (i - (order-1)/2)*0.15; // 多鍵稍微偏移
        const geometry = new THREE.CylinderGeometry(bondRadius, bondRadius, distance, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.copy(midpoint);
        // 設定方向
        cylinder.lookAt(atom2.mesh.position);
        cylinder.rotateX(Math.PI/2);
        cylinder.position.add(new THREE.Vector3(0, angleOffset, 0));
        scene.add(cylinder);
        bonds.push(cylinder);
    }
}

// DOM事件
document.getElementById('add-atom').addEventListener('click', ()=>{
    const element = document.getElementById('element-select').value;
    addAtom(element);
});

document.getElementById('connect-bond').addEventListener('click', ()=>{
    if(atoms.length<2) return alert('至少要有兩個原子才能連接');
    const leftOrder = parseInt(document.getElementById('left-bond').value);
    const rightOrder = parseInt(document.getElementById('right-bond').value);
    const angle = parseFloat(document.getElementById('bond-angle').value);

    const a1 = atoms[atoms.length-2];
    const a2 = atoms[atoms.length-1];

    if(leftOrder>0) addBond(a2,a1,leftOrder); // a2 左邊連 a1
    if(rightOrder>0) addBond(a1,a2,rightOrder); // a1 右邊連 a2
});

// 渲染迴圈
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}
animate();

// 調整視窗大小
window.addEventListener('resize', ()=>{
    camera.aspect = (window.innerWidth-250)/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth-250, window.innerHeight);
});
