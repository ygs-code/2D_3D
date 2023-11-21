export const createHtmlMatrix = (() => {
  
  return (mat, row, list, id) => {
    let el = document.getElementById(id);
    let oDiv;
    if (!el) {
      oDiv = document.createElement("div");
      document.body.appendChild(oDiv);
    } else {
      oDiv = el;
    }

    oDiv.id = id;
    oDiv.className = "box";
    let html = "";
    for (let i = 0; i < row; i++) {
      html += `<div>`;
      for (let j = 0; j < list; j++) {
        html += `<span title="${mat[i * list + j]}">${
          mat[i * list + j]
        },</span> `;
      }
      html += `</div>`;
    }
    oDiv.innerHTML = html;

    // if (!el) {
    //   document.body.appendChild(oDiv);
    // }
  };
})();
