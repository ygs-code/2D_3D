import initShader from "@/pages/3d/utils/initShader.js";
import m4 from "@/pages/3d/utils/comments/m4.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix";
import vertexShader from "./index.vert";
import fragmentShader from "./index.frag";
import  {createCubeData, createBuffersForCube} from "./cube";
import "./index.less";

window.onload = function () {


/*
  Placing points directly into clip space is of limited use. What's better is
  to take model data and transform it into clip space. The cube is an easy example
  of how to do this. The cube data below consists of vertex positions, the colors
  of the faces of the cube, and the order of the vertex positions that make up
  the individual polygons (in groups of 3). The positions and colors are stored in
  buffers and sent to the shader as attributes, and then operated upon individually.

  Finally a single model matrix is set that represents the transformations that will
  be performed on each position that makes up the model to move it into the correct
  space. In this case, for every frame of the animation, a series of scale, rotation,
  and translation matrices move the data into the desired spot in clip space. The
  cube is the size of clip space (-1,-1,-1) to (1,1,1) so it will need to be shrunk
  down to fit. This matrix is sent to the shader having been multiplied in JavaScript
  beforehand.
  
  In the shader each position vertex is first transformed into a homogeneous
  coordinate (vec4), and then multiplied against the model matrix.

    gl_Position = model * vec4(position, 1.0);

  It may be noted that in JavaScript matrix multiplication requires a function,
  while in the shader it is built into the language with the simple * operator.

  At this point the W value of the transformed point is still 1.0. The cube still
  doesn't have any perspective. The next example will take this setup, and fiddle
  with the W values to provide some perspective.

  Exercise:

    1) Shrink down the box using the scale matrix and position it in different places
    within clip space. Try moving it outside of clip space. Resize the window
    and watch as the box skews out of shape. Add a rotateZ matrix.

    2) Modify the MDN.createCubeData() function in /shared/cube.js to change the underlying
    data for the cube and note how the model transform perserves it. (Make sure and
    restore it once you are done for the other examples.)
    
*/


/*
 矩阵 A * B

 写作  
 [
  B,
  A
 ]
*/

// console.log(MDN.multiplyArrayOfMatrices([
//   [
//     5,6,0,0,
//     7,8,0,0,
//     0,0,0,0,
//     0,0,0,0,
//   ],
//   [
//     1,2,0,0,
//     3,4,0,0,
//     0,0,0,0,
//     0,0,0,0,
//   ],

// ])
// )



function CubeDemo () {

  //   // Setup the canvas and WebGL context
  this.canvas =document.createElement("canvas");
  document.body.appendChild(this.canvas);
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  if (!this.canvas.getContext) return;
  let gl = this.canvas.getContext("webgl");

  // this.canvas.height = window.innerHeight;

  this.gl=gl; 

  
  // Prep the canvas
  // 获取canvas dom
  // this.canvas = document.getElementById("canvas");
  // this.canvas.width = window.innerWidth;
  // this.canvas.height = window.innerHeight;
  
  // Grab a context
  // 获取gl Context
  // this.gl = MDN.createContext(this.canvas);

  this.transforms = {}; // All of the matrix transforms
  this.locations = {}; //All of the shader locations
  
  // MDN.createBuffersForCube and MDN.createCubeData are located in /shared/cube.js
  // 创建buffer
  this.buffers = createBuffersForCube(this.gl, createCubeData() );
  
  // 创建program
  this.webglProgram = this.setupProgram();
  
}
  // 创建program
CubeDemo.prototype.setupProgram = function() {
  
  var gl = this.gl;
    
  // Setup a WebGL program
  // 创建program
  // var webglProgram = MDN.createWebGLProgramFromIds(gl, "vertex-shader", "fragment-shader");
  var webglProgram = initShader(gl, vertexShader, fragmentShader);

 

  // initShader
  gl.useProgram(webglProgram);
  
  // Save the attribute and uniform locations
  // 获取 Uniform 变量 model 地址
  this.locations.model = gl.getUniformLocation(webglProgram, "model");
   // 获取 Attrib 变量 position 地址
  this.locations.position = gl.getAttribLocation(webglProgram, "position");
    // 获取 Attrib 变量 color 地址 
  this.locations.color = gl.getAttribLocation(webglProgram, "color");
  
  // Tell WebGL to test the depth when drawing
  //告诉WebGL在绘制时测试深度
  gl.enable(gl.DEPTH_TEST);
  
  return webglProgram;
};





console.log(
  'aaaaaaaaa',
  m4.multiply(
    [
      5,6,0,0,
      7,8,0,0,
      0,0,0,0,
      0,0,0,0,
    ] ,
  
    [
      1,2,0,0,
      3,4,0,0,
      0,0,0,0,
      0,0,0,0,
    ]
   
  )

);




// 计算模型矩阵
CubeDemo.prototype.computeModelMatrix = function( now ) {

  //See /shared/matrices.js for the definitions of these matrix functions

  //Scale down by 50%
  // 缩放 缩小
  var scale = m4.scaling(0.5, 0.5, 0.5);
  
  // Rotate a slight tilt 轻微倾斜旋转
  var rotateX = m4.xRotation( now * 0.0005);


   
  // Rotate according to time  根据时间旋转
  var rotateY = m4.yRotation( now * 0.0005);

  var rotateZ = m4.zRotation( now * 0.0005);


  // Move slightly down //稍微向下移动
  var position = m4.translation(0, -0.1, 0);
  
  // Multiply together, make sure and read them in opposite order
  // 乘在一起，确保按相反的顺序读

  /*
  模型矩阵可以把模型的局部坐标变换为世界坐标。
  需要对模型进行缩放、绕xyz轴旋转、平移（注意：三个操作的先后顺序不能变） 。
  */

  
  // console.log('  scale ==', scale );
  // console.log('rotateX',  rotateX );
  
  // console.log(' rotateY ==',  rotateY );
  


  // vectorMultiply
  this.transforms.model = m4.multiply(rotateX ,scale);
  this.transforms.model = m4.multiply(rotateY, this.transforms.model);
  this.transforms.model = m4.multiply(position, this.transforms.model);
 

  createHtmlMatrix({matrix:this.transforms.model, title: "model矩阵", row: 4, list: 4, elId: "model"});

  // debugger;


  // this.transforms.model = m4.multiply(rotateY, this.transforms.model);
  // this.transforms.model = m4.multiply(position,this.transforms.model);

  // this.transforms.model = MDN.multiplyArrayOfMatrices([
  //   position, // step 4
  //   rotateY,  // step 3
  //   rotateX,  // step 2
  //   scale     // step 1
  // ]);
  
  
  // Performance caveat: in real production code it's best not to create
  // new arrays and objects in a loop. This example chooses code clarity
  // over performance.
};

CubeDemo.prototype.draw = function() {
  
  var gl = this.gl;
  var now = Date.now();
  
  // Compute our matrices
  this.computeModelMatrix( now );
  
  // Update the data going to the GPU
  this.updateAttributesAndUniforms();
  
  // Perform the actual draw
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  
  // this.draw();
  // Run the draw as a loop
  requestAnimationFrame( this.draw.bind(this) );
};

CubeDemo.prototype.updateAttributesAndUniforms = function() {

  var gl = this.gl;

 
  
  // Setup the color uniform that will be shared across all triangles
  gl.uniformMatrix4fv(this.locations.model, false, new Float32Array(this.transforms.model));
  
  // Set the positions attribute
  gl.enableVertexAttribArray(this.locations.position);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
  gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute
  gl.enableVertexAttribArray(this.locations.color);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
  gl.vertexAttribPointer(this.locations.color, 4, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.elements );
  
};

var cube = new CubeDemo();

cube.draw();


};
