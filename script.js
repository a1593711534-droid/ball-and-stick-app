// 化合物資料
const compounds = {
    methane: { smiles: "C", formula: "CH₄" },
    ethane: { smiles: "CC", formula: "C₂H₆" },
    propane: { smiles: "CCC", formula: "C₃H₈" },

    methanol: { smiles: "CO", formula: "CH₃OH" },
    ethanol: { smiles: "CCO", formula: "C₂H₅OH" },
    propanol: { smiles: "CCCO", formula: "C₃H₇OH" },

    dimethyl_ether: { smiles: "COC", formula: "C₂H₆O" },
    diethyl_ether: { smiles: "CCOCC", formula: "C₄H₁₀O" },
    methyl_ethyl_ether: { smiles: "CCOC", formula: "C₃H₈O" }
};

let viewer;

// 初始化 3D viewer
function initViewer() {
    viewer = new $3Dmol.GLViewer("viewer", {
        backgroundColor: "white"
    });
}

initViewer();

// 顯示化合物
function showCompound(key) {
    const data = compounds[key];
    if (!data) return;

    // 更新化學式
    document.getElementById("formulaText").textContent = data.formula;

    // 下載 3D 結構
    viewer.clear();

    const url =
        "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/" +
        data.smiles +
        "/SDF?record_type=3d";

    $3Dmol.download(url, viewer, {}, function () {
        viewer.setStyle({}, { stick: {} });
        viewer.zoomTo();
        viewer.render();
    });
}

// 下拉事件
document.getElementById("compoundSelect").addEventListener("change", function () {
    const key = this.value;
    if (key) showCompound(key);
});
