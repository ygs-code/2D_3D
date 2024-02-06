                                                                                                                             // export const fData = new Float32Array([
//   // left column
//   /*
//         F 的左边 | 
//         */
//   // x    y   z
//   // 第一个三角形
//       0, 0, 0,
//       30/100, 0, 0,
//       0, 150/100, 0,

//   // 第二个三角形
//       0, 150/100, 0, 
//       30, 0, 0,
//       30, 150/100, 0,

//   /*
//         F 的顶部 ——
//         */
//   // top rung
//   // 第一个三角形
//       30/100, 0, 0,
//       100/100, 0, 0,
//       30/100, 30/100, 0,

//   // 第二个三角形
//       30/100, 30/100, 0, 
//       100/100, 0, 0,
//       100/100, 30/100, 0,
//   /*
//         F 的第二条 ——
//         */
//   // middle rung
//   // 第一个三角形
//       30/100, 60/100, 0, 
//       67/100, 60/100, 0,
//       30/100, 90/100, 0,
//   // 第二个三角形
//       30/100, 90/100, 0,
//       67/100, 60/100, 0,
//       67/100, 90/100, 0
// ]);

/*
     +1 
-1        +1
     -1
*/



export const fData = new Float32Array([
       0.0,  0.5,   1.0,
       -0.5, -0.5,  1.0,
       0.5,  -0.5,  1.0,
    ]);