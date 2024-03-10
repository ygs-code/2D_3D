import initShader from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
import {fData} from "./data";
 
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import {Matrix4}  from "@/pages/3d/utils/lib/cuon-matrix";
 

 
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
  let gl = canvas.getContext("webgl");
   
 
  

  // 创建着色器源码
  const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    varying vec4 vColor;

    uniform mat4 mat;
    void main() {
      gl_Position = mat * aPosition;
      vColor = aColor;
    }
  `; // 顶点着色器

  const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `; // 片元着色器

  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const mat = gl.getUniformLocation(program, 'mat');

  const vertices = new Float32Array([
    // 0123
    1, 1, 1,   // 0
    -1, 1, 1,  // 1
    -1,-1, 1,  // 2
    1,-1, 1,   // 3
    // 0345 
    1, 1, 1,   // 4
    1,-1, 1,   // 5 
    1,-1,-1,   // 6
    1, 1,-1,   // 7
    // 0156
    1, 1, 1,   // 8
    1, 1, -1,  // 9
    -1, 1,-1,  // 10
    -1, 1,1,   // 11
    // 1267
    -1, 1, 1,  // 12
    -1,1, -1,  // 13
    -1, -1,-1,  //14
    -1,-1,1,   // 15
    // 2347
    -1,-1, 1,  // 16
    1,-1, 1,   // 17
    1,-1,-1,   // 18
    -1,-1,-1,  // 19
    // 4567  
    1,-1,-1,   // 20
    1, 1,-1,   // 21
    -1, 1,-1,  // 22
    -1,-1,-1,  // 23
  ]);

  /*
     1, 1, 1,   0
    -1, 1, 1,   1
    -1,-1, 1,   2
     1,-1, 1,   3
     1,-1,-1,   4
     1, 1,-1,   5
    -1, 1,-1,   6
    -1,-1,-1,   7
  * */
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  const colors = new Float32Array([
    0.4, 0.4, 1.0,  // 0
    0.4, 0.4, 1.0,  // 1
    0.4, 0.4, 1.0,  // 2
    0.4, 0.4, 1.0,  // 3
    0.4, 1.0, 0.4,  // 4
    0.4, 1.0, 0.4,  // 5
    0.4, 1.0, 0.4,  // 6
    0.4, 1.0, 0.4,  // 7
    1.0, 0.4, 0.4,  // 8
    1.0, 0.4, 0.4,  // 9
    1.0, 0.4, 0.4,  // 10
    1.0, 0.4, 0.4,  // 11
    1.0, 1.0, 0.4,  // 12
    1.0, 1.0, 0.4,  // 13
    1.0, 1.0, 0.4,  // 14
    1.0, 1.0, 0.4,  // 15
    1.0, 0.0, 1.0,  // 16
    1.0, 0.0, 1.0,  // 17
    1.0, 0.0, 1.0,  // 18
    1.0, 0.0, 1.0,  // 19
    0.0, 1.0, 1.0,  // 20
    0.0, 1.0, 1.0,  // 21
    0.0, 1.0, 1.0,  // 22
    0.0, 1.0, 1.0,  // 23
  ]);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  // 3个为一组
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColor);

  // 顶点索引
  const indeces = new Uint8Array([
    // 选择渲染的顶点
    0,1,2,
    0,2,3,
    4,5,6,
    4,6,7,
    8,9,10,
    8,10,11,
    12,13,14,
    12,14,15,
    16,17,18,
    16,18,19,
    20,21,22,
    20,22,23,
  ]);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indeces, gl.STATIC_DRAW);

  let eyex = 3;
  let eyey = 3;
  let eyez = 5;

  let deg = 0;
  function draw() {
    deg += 0.1;
    var modelMatrix = new Matrix4(); // Model matrix
    var viewMatrix = new Matrix4();  // View matrix
    var projMatrix = new Matrix4();  // Projection matrix
    var mvpMatrix = new Matrix4();   // Model view projection matrix
    viewMatrix.setLookAt(eyex,eyey,eyez,0.0,0.0,0.0,0.0,0.6,0.0);
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    gl.enable(gl.DEPTH_TEST);
    // Calculate the model view projection matrix
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    mvpMatrix.rotate(deg,0,0,1);
    gl.uniformMatrix4fv(mat, false, mvpMatrix.elements);
    // 渲染索引
    gl.drawElements(gl.TRIANGLES, indeces.length, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(draw);
  }

  draw();
 
};
