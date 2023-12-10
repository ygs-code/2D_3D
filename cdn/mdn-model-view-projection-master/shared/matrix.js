/*
  矩阵一些方法
 */

/* eslint-disable   */

(function (root, factory) {
  // eslint-disable-line
  if (typeof define === "function" && define.amd) {
    // BMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Arowser globals
    root.matrix = factory();
  }
})(this, function () {
  "use strict";
  /*
  matrix:矩阵
  title：输出矩阵的标题
  row：矩阵行
  list：矩阵列  比如 矩阵是 4行3列  就传入  row:3  list:4
  elId：矩阵输出到html中的节点id
  */
  function createHtmlMatrix({ matrix, title, row, list, elId }) {
     
    let style = document.getElementById("create-html-matrix");
    if (!style) {
      style = document.createElement("style");
      style.id = "create-html-matrix";
      style.innerHTML = `
              .create-html-matrix {
                position: relative;
                width: auto;
                height: auto;
                border-left: 1px solid #0e393b;
                border-right: 1px solid #0e393b;
                overflow: hidden;
                display: inline-block;
              }
              .create-html-matrix::after {
                content: "";
                width: 10px;
                height: calc(100% - 2px);
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                border-bottom: 1px solid #0e393b;
                border-top: 1px solid #0e393b;
              }
              
              .create-html-matrix::before {
                content: "";
                width: 10px;
                height: calc(100% - 2px);
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                border-bottom: 1px solid #0e393b;
                border-top: 1px solid #0e393b;
              }
              
              .create-html-matrix div span {
                width: 50px;
                display: inline-block;
                text-align: center;
                overflow: hidden;
                padding: 10px;
              }
      
      `;
     
      document.body.appendChild(style);
    }

    let el = document.getElementById(elId);
    let oDiv;
    if (!el) {
      oDiv = document.createElement("div");
      document.body.appendChild(oDiv);
    } else {
      oDiv = el;
    }

    oDiv.id = elId || "createHtmlMatrix";
    let html = `
       ${title} : <div class="create-html-matrix"> 
    `;
    for (let i = 0; i < row; i++) {
      html += `<div>`;
      for (let j = 0; j < list; j++) {
        html += `<span title="${matrix[i * list + j]}">${matrix[i * list + j]}${
          j < list - 1 ? "," : ""
        }</span> `;
      }
      html += `</div>`;
    }
    html += `</div>`;
    oDiv.innerHTML = html;

    // if (!el) {
    //   document.body.appendChild(oDiv);
    // }
  }

  function filterList(mat, lsit) {
    return lsit.reduce(($acc, $item, $index) => {
      if (
        mat.list.start !== undefined &&
        mat.list.end !== undefined &&
        $index >= mat.list.start &&
        $index <= mat.list.end
      ) {
        $acc.push($item);
      } else if (
        mat.list.start !== undefined &&
        mat.list.end === undefined &&
        $index >= mat.list.start
      ) {
        $acc.push($item);
      } else if (
        mat.list.start === undefined &&
        mat.list.end !== undefined &&
        $index <= mat.list.end
      ) {
        $acc.push($item);
      } else if (mat.list.start === undefined && mat.list.end === undefined) {
        $acc.push($item);
      }
      return $acc;
    }, []);
  }
  // 过滤矩阵
  function convertData(mat) {
    // 变成有序的矩阵
    let $mat = mat.matrix.reduce((acc, item, index) => {
      let $index = Math.floor(index / mat.list.n);
      acc[$index] = [...(acc[$index] || []), item];
      return acc;
    }, []);

    $mat = $mat.reduce((acc, item, index) => {
      // 过滤掉不需要的行数据
      if (
        mat.row.start !== undefined &&
        mat.row.end !== undefined &&
        index >= mat.row.start &&
        index <= mat.row.end
      ) {
        // 过滤掉不需要的列 数据
        acc.push(filterList(mat, item));
      } else if (
        mat.row.end === undefined &&
        mat.row.start !== undefined &&
        index >= mat.row.start
      ) {
        acc.push(filterList(mat, item));
      } else if (
        mat.row.start === undefined &&
        mat.row.end !== undefined &&
        index <= mat.row.end
      ) {
        acc.push(filterList(mat, item));
      } else if (mat.row.start === undefined && mat.row.end === undefined) {
        acc.push(filterList(mat, item));
      }

      return acc;
    }, []);

    return $mat;
  }

  // 矩阵转置
  /*
    转置矩阵的 (B*A)T不等于BT*AT
  */
  function transpose(mat) {
    let $mat = [];
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].length; j++) {
        if (!$mat[j]) {
          $mat[j] = [];
        }
        $mat[j][i] = mat[i][j];
      }
    }
    return $mat;
  }


  /*
    矩阵 a* b
    写作  multiply(b, a)
  */
  // 矩阵相乘
  function multiply(b, a) {
    // 变成有序的矩阵
    let B = convertData(a);
    let A = convertData(b);

    // 矩阵转置
    // let B = transpose($A);
    // let A = transpose($B);
    console.log("B===", B);
    console.log("A===", A);
    let list = B[0].length;
    let row = A.length;

    if (B.length == 1) {
      // 那么他是列主序
      // 如果列主序的矩阵列小于线性变换的矩阵，则让他少于的位置添加1
      if (list < row) {
        for (let i = 0; i < row - list; i++) {
          B[0].push(1);
        }
        // 更新列
        list = B[0].length;
      }
    }

    if (row !== list) {
      throw "矩阵B的行数不等于矩阵A列数，所以矩阵不能相乘";
    }
    // 矩阵相乘
    let sum = 0;
    let $mat = [];
    let flag = false;

    for (let $i = 0; $i < B.length; $i++) {
      sum = 0;
      // 循环列
      for (let $j = 0; $j < B[$i].length; $j++) {
        // 循环 行
        sum = 0;
        flag = false;

        for (
          let i = 0;
          i < A.length && B[$i][i] !== undefined && A[i][$j] !== undefined;
          i++
        ) {
          flag = true;
          sum += B[$i][i] * A[i][$j];
        }
        if (flag) {
          $mat.push(sum);
        }
      }
    }

    return $mat;
  }

  /*
  
  一般矩阵是线性变换矩阵在前面，输入矩阵在后面

  列主序的 向量矩阵 在 前面 ，线性变换矩阵在后面，

  然后列主序和线性变换矩阵转置之后，列主序矩阵变成行矩阵，然后线性变换矩阵就在矩阵的前面这个是数学中的

  (B*A)T=AT*BT

  */
    
  let mat4 = multiply(
    {
      //
      matrix: eval(`[
         // x   y   z   w  
           
        4,  5,  0,  0, 
        6,  7,  0,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,             
    
  
            //  'a0','a1','a2','a3',  'b0','b1','b2','b3',  'c0','c1','c1','c3', 
            //  'd0','d1','d2','d3',  'e0','e1','e2','e3',  'f0','f1','f1','f3', 
            //  'g0','g1','g2','g3',  'g0','g1','g2','g3',  'g0','g1','g1','g3', 
            //  'h0','h1','h2','h3',  'h0','h1','h2','h3',  'h0','h1','h1','h3', 
            //  'i0','i1','i2','i3',  'i0','i1','i2','i3',  'i0','i1','i1','i3', 
            //  'j0','j1','j2','j3',  'j0','j1','j2','j3',  'j0','j1','j1','j3', 
            //  'k0','k1','k2','k3',  'k0','k1','k2','k3',  'k0','k1','k1','k3', 
            ]`),
      row: {
        n: 2
        // start: 0,
        // end: 3
      },
      list: {
        n: 4
        // start: 0,
        // end: 3
      }
    },

    {
      matrix: eval(`[
        // x  y  z  w  
    
        1,  2,  0,  0, 
        3,  4,  0,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,   

            //  'a10','a11','a12','a13',  'b10','b11','b12','b13',  'c10','c11','c11','c13', 
            //  'd10','d11','d12','d13',  'e10','e11','e12','e13',  'f10','f11','f11','f13', 
            //  'g10','g11','g12','g13',  'g10','g11','g12','g13',  'g10','g11','g11','g13', 
            //  'h10','h11','h12','h13',  'h10','h11','h12','h13',  'h10','h11','h11','h13', 
            //  'i10','i11','i12','i13',  'i10','i11','i12','i13',  'i10','i11','i11','i13', 
            //  'j10','j11','j12','j13',  'j10','j11','j12','j13',  'j10','j11','j11','j13', 
            //  'k10','k11','k12','k13',  'k10','k11','k12','k13',  'k10','k11','k11','k13', 
            ]`),
      row: {
        n: 4
        // start: 0,
        // end: 0
      },
      list: {
        n: 4
        // start: 0,
        // end: 3
      }
    }
  );

  console.log("mat4==", mat4);
  

  return {
    createHtmlMatrix,
    filterList,
    convertData,
    transpose,
    multiply
  };
});
/* eslint-enable   */
