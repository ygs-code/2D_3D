/*
  矩阵一些方法
 */

/* eslint-disable   */

(function (root, factory) {
  // eslint-disable-line
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.matrix = factory();
  }
})(this, function () {
  "use strict";

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

  // 矩阵相乘
  function multiply(a, b) {
    // 变成有序的矩阵
    let A = convertData(a);
    let B = convertData(b);

    // 矩阵转置
    // A = transpose(A);
    // B = transpose(B);
    let row = A[0].length;
    let list = B.length;
    if (row !== list) {
      throw "矩阵A的行数不等于矩阵B列数，所以矩阵不能相乘";
    }

    console.log("A==", A);
    console.log("B==", B);
    // 矩阵相乘
    let sum = 0;
    let $mat = [];
    let flag = false;

    for (let $i = 0; $i < A.length; $i++) {
      sum = 0;
      // 循环列
      for (let $j = 0; $j < A[$i].length; $j++) {
        // 循环 行
        sum = 0;
        flag = false;
        for (let i = 0; i < B.length && B[i][$j] !== undefined; i++) {
          flag = true;
          //     console.log("A-----", A[$i][i]);
          //     console.log("A-----", B[i][$j]);
          //   console.log('i-----',i)
          // // console.log('j-----',j)
          // // console.log('$i-----',$i)
          // console.log('$j-----',$j)
          //   console.log("B[i]==", B[i]);
          //   console.log("B[i][$j]==", B[i][$j]);
          //   console.log("$j==", $j);

          sum += A[$i][i] * B[i][$j];
          // console.log("B-----", B[$j][$i]);
        }

        // sum += A[$i][$j] * B[$j][$i];
        // console.log('i-----',i)
        // // console.log('j-----',j)
        // console.log('$i-----',$i)
        // console.log('$j-----',$j)
        // console.log('sum-----',sum)
        // console.log("\n");

        //  sum += A[i][j] * B[j][i];
        // console.log('A-------[i][j]========',A[$i][$j])
        // console.log("A[$i][$j===", A[$i][$j]);
        // console.log("B[$j][$i]===", B[$j][$i]);
        // console.log("A[i][j] * B[j][i]===", A[$i][$j] * B[$j][$i]);

        //   sum += A[$i][$j] * B[$j][$i];
        // console.log('i-----',$i)
        // console.log('j-----',$j)
        //     for (let $j = 0; $j < B[j].length; $j++) {

        //         // console.log('A[i][j]=',A[i][j])
        //         console.log('B------[j][$j]======',B[j][$j])

        //         console.log('j-----',j)
        //         console.log('$j-----',$j)
        //         console.log('\n \n')

        //         // console.log('A*B=',A[i][j]*B[j][$j])

        // //   A[i][j]
        //         //  sum += A[i][j] * B[j][i];

        //         // console.log("A[i][j]=", A[i][j]);
        //         // console.log("B[j][0]=", B[j][0]);
        //     }

        // console.log("A[i][j]=", A[i][j]);
        // console.log("B[j][0]=", B[j][0]);

        // if (flag) {
        $mat.push(sum);
        // }
      }
      //   $mat.push(sum);
      console.log("\n");
    }

    return $mat;
  }

  let mat4 = multiply(
    {
      matrix: eval(`[
            //    x   y   z     w            
            //   0,1,2,3, 
            //   4,5,6,7,
            //   8,9,10,11,
            //   12,13,14,15       
            
            1,0,0,1, 
            0,1,0,0, 
            0,0,1,0, 
            0,0,0,1, 
            // 1,0,
            // 0,1
            // 4,5,6,7,
            // 8,9,10,11,
            // 12,13,14,15     
            //  'a0','a1','a2','a3',  'b0','b1','b2','b3',  'c0','c1','c1','c3', 
            //  'd0','d1','d2','d3',  'e0','e1','e2','e3',  'f0','f1','f1','f3', 
            //  'g0','g1','g2','g3',  'g0','g1','g2','g3',  'g0','g1','g1','g3', 
            //  'h0','h1','h2','h3',  'h0','h1','h2','h3',  'h0','h1','h1','h3', 
            //  'i0','i1','i2','i3',  'i0','i1','i2','i3',  'i0','i1','i1','i3', 
            //  'j0','j1','j2','j3',  'j0','j1','j2','j3',  'j0','j1','j1','j3', 
            //  'k0','k1','k2','k3',  'k0','k1','k2','k3',  'k0','k1','k1','k3', 
            ]`),
      row: {
        n: 4,
        start: 0,
        end: 3
      },
      list: {
        n: 4,
        start: 0,
        end: 3
      }
    },

    {
      matrix: eval(`[
            //  x   y   z     w   
            0,1,2,3, 
            4,5,6,7,
            8,9,10,11,
            12,13,14,15    
            //  'a10','a11','a12','a13',  'b10','b11','b12','b13',  'c10','c11','c11','c13', 
            //  'd10','d11','d12','d13',  'e10','e11','e12','e13',  'f10','f11','f11','f13', 
            //  'g10','g11','g12','g13',  'g10','g11','g12','g13',  'g10','g11','g11','g13', 
            //  'h10','h11','h12','h13',  'h10','h11','h12','h13',  'h10','h11','h11','h13', 
            //  'i10','i11','i12','i13',  'i10','i11','i12','i13',  'i10','i11','i11','i13', 
            //  'j10','j11','j12','j13',  'j10','j11','j12','j13',  'j10','j11','j11','j13', 
            //  'k10','k11','k12','k13',  'k10','k11','k12','k13',  'k10','k11','k11','k13', 
            ]`),
      row: {
        n: 4,
        start: 0,
        end: 3
      },
      list: {
        n: 4,
        start: 0,
        end: 3
      }
    }
  );

  console.log("mat4==", mat4);
  let $mat4 = convertData({
    matrix: mat4,
    row: {
      n: 4
    },
    list: {
      n: 4
    }
  });

  let $$mat4 = transpose($mat4);
  console.log("$mat4==", $mat4);
  console.log("$$mat4==", $$mat4);
  return {
    multiply
  };
});
/* eslint-enable   */
