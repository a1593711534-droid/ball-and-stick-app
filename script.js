// Three.js 基本設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth-250)/window.innerHeight, 0.1, 1000);
camera.position.set(5,5,10);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth-250, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

scene.add(new THREE.AmbientLight(0x888888));
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,10,10);
scene.add(light);

// 原子資料
const atoms = [];
const bonds = [];

// 原子相對半徑
const atomRadii = { H:0.25, C:0.7, O:0.65, N:0.65, Cl:1.0 };
const atomColors = { H:0xffffff, C:0x000000, O:0xff0000, N:0x0000ff, Cl:0x00ff00 };

// 新增原子
function addAtom(element, position=new THREE.Vector3(0,0,0)){
    const radius = atomRadii[element];
    const geometry = new THREE.SphereGeometry(radius,32,32);
    const material = new THREE.MeshPhongMaterial({color:atomColors[element]});
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    scene.add(sphere);
    atoms.push({element, mesh:sphere, radius, left:null, right:null});
    addBondControls(atoms[atoms.length-1]);
}

// 建立化學鍵
function addBond(a1, a2, order=1){
    const start = a1.mesh.position.clone();
    const end = a2.mesh.position.clone();
    const dir = new THREE.Vector3().subVectors(end,start);
    const distance = dir.length();
    const midpoint = new THREE.Vector3().addVectors(start,end).multiplyScalar(0.5);

    for(let i=0;i<order;i++){
        const offset = (i-(order-1)/2)*0.15;
        const geom = new THREE.CylinderGeometry(0.1,0.1,distance,16);
        const mat = new THREE.MeshPhongMaterial({color:0xaaaaaa});
        const cyl = new THREE.Mesh(geom, mat);
        cyl.position.copy(midpoint);
        cyl.lookAt(end);
        cyl.rotateX(Math.PI/2);
        cyl.position.add(new THREE.Vector3(0,offset,0));
        scene.add(cyl);
        bonds.push(cyl);
    }
}

// DOM 控件
document.getElementById('add-atom').addEventListener('click',()=>{
    const el = document.getElementById('element-select').value;
    const pos = new THREE.Vector3(atoms.length*2,0,0);
    addAtom(el,pos);
});

// 為每個原子新增左右鍵選單
function addBondControls(atom){
    const container = document.getElementById('bond-controls');

    ['left','right'].forEach(side=>{
        const div = document.createElement('div');
        div.classList.add('bond-option');

        const bondSelect = document.createElement('select');
        [0,1,2,3].forEach(v=>{
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v===0 ? '無鍵' : (v===1?'單鍵':v===2?'雙鍵':'三鍵');
            bondSelect.appendChild(opt);
        });
        div.appendChild(document.createTextNode(`${atom.element} ${side}鍵:`));
        div.appendChild(bondSelect);

        const atomSelect = document.createElement('select');
        ['C','H','O','N','Cl'].forEach(e=>{
            const opt = document.createElement('option');
            opt.value=e; opt.textContent=e;
            atomSelect.appendChild(opt);
        });
        div.appendChild(atomSelect);

        const btn = document.createElement('button');
        btn.textContent = '連接';
        btn.addEventListener('click',()=>{
            const bondOrder = parseInt(bondSelect.value);
            if(bondOrder>0){
                const newEl = atomSelect.value;
                const dir = side==='left' ? -1 : 1;
                const pos = atom.mesh.position.clone().add(new THREE.Vector3(dir*2,0,0));
                addAtom(newEl,pos);
                addBond(atom,atoms[atoms.length-1],bondOrder);
            }
        });
        div.appendChild(btn);

        container.appendChild(div);
    });
}

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
