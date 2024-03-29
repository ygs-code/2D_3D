// Define the MDN global if it doesn't already exist


// Define the data that is needed to make a 3d cube
//定义制作3d立方体所需的数据
const createCubeData = function() {
  
  // 顶点位置
  var positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];
  
  // 颜色
  var colorsOfFaces = [
    [0.3,  1.0,  1.0,  1.0],    // Front face: cyan
    [1.0,  0.3,  0.3,  1.0],    // Back face: red
    [0.3,  1.0,  0.3,  1.0],    // Top face: green
    [0.3,  0.3,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.3,  1.0],    // Right face: yellow
    [1.0,  0.3,  1.0,  1.0]     // Left face: purple
  ];
  
  var colors = [];

  for (var j=0; j<6; j++) {
    var polygonColor = colorsOfFaces[j];
    
    for (var i=0; i<4; i++) {
      colors = colors.concat( polygonColor );
    }
  }
  
  var elements = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];
  
  return {
    positions: positions,
    elements: elements,
    colors: colors
  };
};

// Take the data for a cube and bind the buffers for it.
// Return an object collection of the buffers
//获取立方体的数据并为其绑定缓冲区。
//返回缓冲区的对象集合
const createBuffersForCube = function( gl, cube ) {
  
  // 创建顶点Buffer
  var positions = gl.createBuffer();
  // 绑定顶点Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.positions), gl.STATIC_DRAW);
  
  // 创建顶点Buffer
  var colors = gl.createBuffer();
  // 绑定顶点Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, colors);
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.colors), gl.STATIC_DRAW);
  

  // 创建顶点Buffer
  var elements = gl.createBuffer();
   // 绑定顶点Buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
  // 向缓冲区写入数据
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.elements), gl.STATIC_DRAW);
  
  return {
    positions: positions,
    colors: colors,
    elements: elements
  };
};


export {
  createCubeData,
  createBuffersForCube
};