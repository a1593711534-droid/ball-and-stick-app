// 高中常見有機化合物資料
const compounds = [
    {
        name: "甲烷",
        formula: "CH4",
        molecular: "C1H4",
        structural: "H\n |\nH-C-H\n |\nH",
        condensed: "CH4",
        smiles: "C"
    },
    {
        name: "乙烷",
        formula: "C2H6",
        molecular: "C2H6",
        structural: "H   H\n|   |\nH-C-C-H\n|   |\nH   H",
        condensed: "CH3CH3",
        smiles: "CC"
    },
    {
        name: "丙烷",
        formula: "C3H8",
        molecular: "C3H8",
        structural: "CH3-CH2-CH3",
        condensed: "CH3CH2CH3",
        smiles: "CCC"
    },
    {
        name: "甲醇",
        formula: "CH3OH",
        molecular: "CH4O",
        structural: "CH3-OH",
        condensed: "CH3OH",
        smiles: "CO"
    },
    {
        name: "乙醇",
        formula: "C2H5OH",
        molecular: "C2H6O",
        structural: "CH3-CH2-OH",
        condensed: "C2H5OH",
        smiles: "CCO"
    },
    {
        name: "水",
        formula: "H2O",
        molecular: "H2O",
        structural: "H-O-H",
        condensed: "H2O",
        smiles: "O"
    },
    {
        name: "二氧化碳",
        formula: "CO2",
        molecular: "CO2",
        structural: "O=C=O",
        condensed: "CO2",
        smiles: "O=C=O"
    },
    {
        name: "苯",
        formula: "C6H6",
        molecular: "C6H6",
        structural: "C6H6 (芳香烴)",
        condensed: "C6H6",
        smiles: "c1ccccc1"
    },
    // 你可以依需求再加更多高中有機化合物
];

// 填入下拉選單
const select = document.getElementById("compoundSelect");
compounds.forEach(c => {
    let option = document.createElement("option");
    option.value = c.smiles;
    option.textContent = c.name;
    select.appendChild(option);
});

let viewer = null;
let currentModel = null;

function showCompound(compound) {
    document.getElementById("formula").textContent = "實驗式: " + compound.formula;
    document.getElementById("molecular").textContent = "分子式: " + compound.molecular;
    document.getElementById("structural").textContent = "結構式: " + compound.structural;
    document.getElementById("condensed").textContent = "示性式/縮寫: " + compound.condensed;

    if (!viewer) {
        viewer = $3Dmol.createViewer("viewer", {defaultcolors: $3Dmol.rasmolElementColors});
    } else {
        viewer.clear();
    }

    // 用 SMILES 建立分子
    viewer.addModel(compound.smiles, "smi");
    viewer.setStyle({}, {stick: {}, sphere: {scale: 0.3}});
    viewer.zoomTo();
    viewer.render();
}

select.addEventListener("change", () => {
    const selectedSmiles = select.value;
    const compound = compounds.find(c => c.smiles === selectedSmiles);
    if (compound) showCompound(compound);
});
