// 化合物資料（含 SMILES 與化學式）
const compounds = {
    methane: {
        smiles: "C",
        formula: "CH₄"
    },
    ethane: {
        smiles: "CC",
        formula: "C₂H₆"
    },
    propane: {
        smiles: "CCC",
        formula: "C₃H₈"
    },
    methanol: {
        smiles: "CO",
        formula: "CH₃OH"
    },
    ethanol: {
        smiles: "CCO",
        formula: "C₂H₅OH"
    },
    propanol: {
        smiles: "CCCO",
        formula: "C₃H₇OH"
    },
    dimethyl_ether: {
        smiles: "COC",
        formula: "C₂H₆O"
    },
    diethyl_ether: {
        smiles: "CCOCC",
        formula: "C₄H₁₀O"
    },
    methyl_ethyl_ether: {
        smiles: "CCOC",
        formula: "C₃H₈O"
    }
};

// 初始化 3Dmol viewer
let viewer = null;
function initViewer() {
    viewer = new $3Dmol.GLViewer("viewer", {
        backgroundColor: "white"
    });
}

initViewer();

// 選單事件
document.getElementById("compoundSelect").addEventListener("change", function () {
    const key = this.value;

    if (!key) return;

    const data = compounds[key];

    // 更新化學式
    document.getElementById("formulaText").innerHTML = data.formula;

    // 載入 3D 模型（使用 SMILES 轉 3D）
    viewer.clear();
    $3Dmol.download("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/" + data.smiles + "/SDF?record_type=3d",
        viewer,
        {},
        function () {
            viewer.setStyle({}, { stick: {} });
            viewer.zoomTo();
            viewer.render();
        }
    );
});
