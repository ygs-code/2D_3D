export const fData = new Float32Array([
  // 前面的F
  // left column front
  // F 中的 左边 |
  // 第一个三角形
  0, 0, 0, 30, 0, 0, 0, 150, 0,

  // 第二个三角形
  0, 150, 0, 30, 0, 0, 30, 150, 0,

  // top rung front
  // F 中的  右边 -
  30, 0, 0, 100, 0, 0, 30, 30, 0,

  30, 30, 0, 100, 0, 0, 100, 30, 0,

  // middle rung front
  /*
       F 的 右边第二条 ——
    */
  30, 60, 0, 67, 60, 0, 30, 90, 0,

  30, 90, 0, 67, 60, 0, 67, 90, 0,

  // 背面的F
  // left column back
  // F 左边的 |
  0, 0, 30, 30, 0, 30, 0, 150, 30,

  0, 150, 30, 30, 0, 30, 30, 150, 30,

  // F 右边的 -
  // top rung back
  30, 0, 30, 100, 0, 30, 30, 30, 30,

  30, 30, 30, 100, 0, 30, 100, 30, 30,

  // 背面 F 中的第二个 -
  // middle rung back
  30, 60, 30, 67, 60, 30, 30, 90, 30,

  30, 90, 30, 67, 60, 30, 67, 90, 30,

  // top  F 中的顶部边的 - 的z面
  0, 0, 0, 100, 0, 0, 100, 0, 30,

  0, 0, 0, 100, 0, 30, 0, 0, 30,

  // top rung right
  // F 上面 第一条 右边 的 z面
  100, 0, 0, 100, 30, 0, 100, 30, 30,

  100, 0, 0, 100, 30, 30, 100, 0, 30,

  // F的右边 第一条 底部的 z 面
  // under top rung
  30, 30, 0, 30, 30, 30, 100, 30, 30,

  30, 30, 0, 100, 30, 30, 100, 30, 0,

  // between top rung and middle
  // F的右边  两 — - 中右边的 贴边
  30, 30, 0, 30, 30, 30, 30, 60, 30,

  30, 30, 0, 30, 60, 30, 30, 60, 0,

  // top of middle rung
  //   F的右边 第二条条 上面底部的 z 面
  30, 60, 0, 30, 60, 30, 67, 60, 30,

  30, 60, 0, 67, 60, 30, 67, 60, 0,

  //   F的右边 第二条条 右边的 贴 面
  // right of middle rung
  67, 60, 0, 67, 60, 30, 67, 90, 30,

  67, 60, 0, 67, 90, 30, 67, 90, 0,

  //
  // bottom of middle rung.
  //   F的右边 第二条 底边的 贴 面
  30, 90, 0, 30, 90, 30, 67, 90, 30,

  30, 90, 0, 67, 90, 30, 67, 90, 0,

  // right of bottom
  //   F的右边 F 下面 那段 | 的右边贴面
  // F 右侧底下
  30, 90, 0, 30, 90, 30, 30, 150, 30,

  30, 90, 0, 30, 150, 30, 30, 150, 0,

  // bottom
  // F 最底部 的 贴面
  0, 150, 0, 0, 150, 30, 30, 150, 30,

  0, 150, 0, 30, 150, 30, 30, 150, 0,

  // F最左侧  |贴面
  // left side
  0, 0, 0, 0, 0, 30, 0, 150, 30,

  0, 0, 0, 0, 150, 30, 0, 150, 0
]);

export const colors = new Float32Array([
  // left column front
  200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
  120,

  // top rung front
  200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
  120,

  // middle rung front
  200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
  120,

  // left column back
  80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

  // top rung back
  80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

  // middle rung back
  80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

  // top
  70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200,
  210,

  // top rung right
  200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200,
  200, 70,

  // under top rung
  210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
  100, 70,

  // between top rung and middle
  210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210,
  160, 70,

  // top of middle rung
  70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180,
  210,

  // right of middle rung
  100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70,
  210,

  // bottom of middle rung.
  76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210,
  100,

  // right of bottom
  140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140,
  210, 80,

  // bottom
  90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130,
  110,

  // left side
  160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
  160, 160, 220
]);
