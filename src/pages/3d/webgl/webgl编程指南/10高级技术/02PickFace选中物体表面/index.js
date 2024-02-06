import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import {Matrix4 ,  Vector3}  from "@/pages/3d/utils/lib/cuon-matrix";
import sky  from "@/assets/image/sky.jpg";
 


import "./index.less";
// import "@/pages/index.less";
window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  // alpha: false
  let gl = canvas.getContext("webgl" ,{

  });
  // vertexShader, fragmentShader

 
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }
   
  var ANGLE_STEP = 20.0; // Rotation angle (degrees/second)

function main() {
  // // Retrieve <canvas> element
  // var canvas = document.getElementById('webgl');

  // // Get the rendering context for WebGL
  // var gl = getWebGLContext(canvas);
  // if (!gl) {
  //   console.log('Failed to get the rendering context for WebGL');
  //   return;
  // }

  // // Initialize shaders
  // if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  //   console.log('Failed to intialize shaders.');
  //   return;
  // }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  // mvp 矩阵
  var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  // 
  var u_PickedFace = gl.getUniformLocation(program, 'u_PickedFace');
  if (!u_MvpMatrix || !u_PickedFace) { 
    console.log('Failed to get the storage location of uniform variable');
    return;
  }

  // Calculate the view projection matrix
  // 视图矩阵
  var viewProjMatrix = new Matrix4();
  // 透视投影
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
  // 相机
  viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Initialize selected surface
  //初始化选定曲面
  gl.uniform1i(u_PickedFace, -1);

  // 当前旋转角度
  var currentAngle = 0.0; // Current rotation angle

  // Register the event handler
  //注册事件处理程序
  canvas.onmousedown = function(ev) {  
     // Mouse is pressed 按下鼠标
    var x = ev.clientX,
     y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      //如果点击位置在<canvas>内，则更新所选表面
      // If Clicked position is inside the <canvas>, update the selected surface
      var x_in_canvas = x - rect.left,
       y_in_canvas = rect.bottom - y;
      var face = checkFace(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix);
    
      gl.uniform1i(u_PickedFace, face); //  将表面编号传递给u PickedFace Pass the surface number to u_PickedFace
      draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
    }
  };

  var tick = function() {   // Start drawing
    currentAngle = animate(currentAngle);
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  var colors = new Float32Array([   // Colors
    0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v0-v1-v2-v3 front
    0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
    0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v0-v5-v6-v1 up
    0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v1-v6-v7-v2 left
    0.27, 0.58, 0.82,  0.27, 0.58, 0.82,  0.27, 0.58, 0.82,  0.27, 0.58, 0.82, // v7-v4-v3-v2 down
    0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
   ]);

   // 顶点颜色信息
  var faces = new Uint8Array([   // Faces

    1, 1, 1, 1,     // v0-v1-v2-v3 front
    2, 2, 2, 2,     // v0-v3-v4-v5 right
    3, 3, 3, 3,     // v0-v5-v6-v1 up
    4, 4, 4, 4,     // v1-v6-v7-v2 left
    5, 5, 5, 5,     // v7-v4-v3-v2 down
    6, 6, 6, 6,     // v4-v7-v6-v5 back
  ]);

  console.log('faces=====',faces);


  var indices = new Uint8Array([   // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  // Write vertex information to buffer object
  if (!initArrayBuffer(gl, vertices, gl.FLOAT, 3, 'a_Position')) return -1; // Coordinates Information
  if (!initArrayBuffer(gl, colors, gl.FLOAT, 3, 'a_Color')) return -1;   
     // Color Information  
     /*
       记录顶点面的信息
     */
  if (!initArrayBuffer(gl, faces, gl.UNSIGNED_BYTE, 1, 'a_Face')) return -1;// Surface Information Surface Information

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

/*
 rgba   用

*/

function checkFace(gl, n, x, y, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix) {
 // 获取像素
  var pixels = new Uint8Array(4); // 用于存储像素值的数组 Array for storing the pixel value
 

  /*
    a_Face ,  face 是顶点标志  1 - 6
    vec3 color = (face == u_PickedFace) ? vec3(1.0) : a_Color.rgb;
    if(u_PickedFace == 0) { // 如果为0，则将面号插入alpha中  In case of 0, insert the face number into alpha
  
     a_Face 值为 1-6       因为在vertex设置1之后  gl.readPixels 获取到像素是 255。
     所以要转换成 1-6 要除以 255，这样 gl.readPixels 就可以获取到 1-6
   
      v_Color = vec4(color, a_Face/255.0);
    } else {
      v_Color = vec4(color, a_Color.a);
    }

    点击 canvas 的 时候 如果是 设置 u_PickedFace 为 0 的时候 就 设置 立方体为透明度为为
    a_Face  1-6/255  
    此时 条件进入 if u_PickedFace == 0     v_Color = vec4(color, a_Face/255.0);
    此时 可以通过  gl.readPixels 就能获取到  1-6 




    然后js获取到 1-6 在传递到 u_PickedFace 中，

    var face = checkFace(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix);
    
     gl.uniform1i(u_PickedFace, face); 


    然后在 此时 就 进入 else 条件中   v_Color = vec4(color, a_Color.a);
    vertex 中 face == u_PickedFace 就相等，这样就吧 立方体 那一面 设置为 白色。

    其他 面 不是 face == u_PickedFace 就设置为  a_Color.rgb颜色


  
  */
  // 标志 u_PickedFace 为 0
  gl.uniform1i(u_PickedFace, 0);  // 通过将表面数字写入alpha值来绘制  Draw by writing surface number into alpha value
 
  draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
  
  // 读取所单击位置的像素值。Pixels[3]为面数  Read the pixel value of the clicked position. pixels[3] is the surface number
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  console.log('第几个面:',pixels[3]);

  return pixels[3];
}

var g_MvpMatrix = new Matrix4(); // Model view projection matrix
function draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix) {
  // Caliculate The model view projection matrix and pass it to u_MvpMatrix
  g_MvpMatrix.set(viewProjMatrix);
  g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0); // Rotate appropriately
  g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
  g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     // Clear buffers
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw
}

var last = Date.now();  // Last time that this function was called
function animate(angle) {
  var now = Date.now(); // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}

function initArrayBuffer (gl, data, type, num, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment to a_attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

 
main(); 
};
