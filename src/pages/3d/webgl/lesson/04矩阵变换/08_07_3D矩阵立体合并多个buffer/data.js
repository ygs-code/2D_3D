let v1 = [-0.5, 0.5, 0.5];
let v2 = [-0.5, -0.5, 0.5];

let v3 = [0.5, -0.5, 0.5];
let v4 = [0.5, 0.5, 0.5];

let v5 = [-0.5, 0.5, -0.5];
let v6 = [-0.5, -0.5, -0.5];

let v7 = [0.5, -0.5, -0.5];
let v8 = [0.5, 0.5, -0.5];

// rgba颜色
/*
  r 是红色
  g 是绿色
  b 是蓝色
*/
//         r    g    b   a
let c1 = [1.0, 0.0, 0.0, 1.0];

let c2 = [0.0, 1.0, 0.0, 1.0];

let c3 = [0.0, 0.0, 1.0, 1.0];

let c4 = [1.0, 1.0, 0.0, 1.0];

let c5 = [0.0, 1.0, 1.0, 1.0];

let c6 = [1.0, 1.0, 1.0, 1.0];

/*
  立方体定点颜色  
  因为webgl是两个三角形连着形成一个面，所以在坐标的时候要注意连着才行，
*/
export let positions = new Float32Array([
  ...v5,
  ...c1,
  ...v6,
  ...c1,
  ...v7,
  ...c1,
  ...v8,
  ...c1, // 前面

  ...v1,
  ...c2,
  ...v2,
  ...c2,
  ...v3,
  ...c2,
  ...v4,
  ...c2, // 后面

  ...v1,
  ...c3,
  ...v4,
  ...c3,
  ...v8,
  ...c3,
  ...v5,
  ...c3, // 左边

  ...v2,
  ...c4,
  ...v3,
  ...c4,
  ...v7,
  ...c4,
  ...v6,
  ...c4, // 右边

  ...v3,
  ...c5,
  ...v4,
  ...c5,
  ...v8,
  ...c5,
  ...v7,
  ...c5, // 上面

  ...v1,
  ...c6,
  ...v2,
  ...c6,
  ...v6,
  ...c6,
  ...v5,
  ...c6 // 下面
]);

console.log("positions==", positions);

// 相当于每个顶点需要一个颜色
export let colors = new Float32Array([
  ...c1,
  ...c1,
  ...c1,
  ...c1, //前面
  ...c2,
  ...c2,
  ...c2,
  ...c2, //后面
  ...c3,
  ...c3,
  ...c3,
  ...c3, //左面
  ...c4,
  ...c4,
  ...c4,
  ...c4, //右面
  ...c5,
  ...c5,
  ...c5,
  ...c5, //上面
  ...c6,
  ...c6,
  ...c6,
  ...c6 //下面
]);
