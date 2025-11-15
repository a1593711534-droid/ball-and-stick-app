const compounds = {
    ch4: {
        name: "甲烷",
        empirical: "CH₄",
        molecular: "CH₄",
        structural: "H–C–H (四面體)",
        semi: "CH₄",
        molfile: `
  CH4
  0  0  0  0  0  0  0  0  0  0  0  0
    0.000 0.000 0.000 C
    0.630 0.630 0.630 H
   -0.630 -0.630 0.630 H
    0.630 -0.630 -0.630 H
   -0.630 0.630 -0.630 H
  5  4  0  0  0
  1 2 1
  1 3 1
  1 4 1
  1 5 1
`
    },

    c2h6: {
        name: "乙烷",
        empirical: "C₂H₆",
        molecular: "C₂H₆",
        structural: "CH₃–CH₃",
        semi: "C₂H₆",
        molfile: `
  C2H6
  6  5  0  0  0
    0.000 0.000 0.000 C
    1.540 0.000 0.000 C
   -0.630 0.630 0.630 H
   -0.630 -0.630 -0.630 H
    2.170 0.630 0.630 H
    2.170 -0.630 -0.630 H
  1  2  1
  1  3  1
  1  4  1
  2  5  1
  2  6  1
`
    },

    c3h8: {
        name: "丙烷",
        empirical: "C₃H₈",
        molecular: "C₃H₈",
        structural: "CH₃–CH₂–CH₃",
        semi: "C₃H₈",
        molfile: `
  C3H8
  11  10  0  0  0
    0.000 0.000 0.000 C
    1.540 0.000 0.000 C
    3.080 0.000 0.000 C
    0.630 0.630 0.630 H
    0.630 -0.630 -0.630 H
   -0.630 -0.630 0.630 H
   -0.630 0.630 -0.630 H
    2.170 0.630 0.630 H
    2.170 -0.630 -0.630 H
    3.710 0.630 0.630 H
    3.710 -0.630 -0.630 H
  1  2  1
  2  3  1
  1  4  1
  1  5  1
  1  6  1
  1  7  1
  2  8  1
  2  9  1
  3 10 1
  3 11 1
`
    }
};

let viewer = null;

function showCompound(id) {
    if (!id) return;

    const c = compounds[id];

    document.getElementById("empirical").textContent = c.empirical;
    document.getElementById("molecular").textContent = c.molecular;
    document.getElementById("structural").textContent = c.structural;
    document.getElementById("semi").textContent = c.semi;

    if (!viewer) {
        viewer = $3Dmol.createViewer("viewer", { backgroundColor: "white" });
    }

    viewer.clear();
    viewer.addModel(c.molfile, "mol");
    viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.3 } });
    viewer.zoomTo();
    viewer.render();
}

document.getElementById("compoundSelect").addEventListener("change", e => {
    showCompound(e.target.value);
});
