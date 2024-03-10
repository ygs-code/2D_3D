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
  // vertexShader, fragmentShader

 
 

 

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

  // 顶点
  const v0 = [1,1,1];
  const v1 = [-1,1,1];
  const v2 = [-1,-1,1];
  const v3 = [1,-1,1];
  const v4 = [1,-1,-1];
  const v5 = [1,1,-1];
  const v6 = [-1,1,-1];
  const v7 = [-1,-1,-1];

  const points = new Float32Array([
    ...v0,...v1,...v2, ...v0,...v2, ...v3, // 前
    ...v0,...v3,...v4, ...v0,...v4, ...v5, // 右
    ...v0,...v5,...v6, ...v0,...v6, ...v1, // 上面
    ...v1,...v6,...v7, ...v1,...v7, ...v2, // 左
    ...v7,...v4,...v3, ...v7,...v3, ...v2, // 底
    ...v4,...v7,...v6, ...v4,...v6, ...v5, // 后
  ]);

  const buffer = gl.createBuffer();

  const BYTES = points.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(aPosition);

  const colorData = new Float32Array([
    1,0,0,
    1,0,0,
    1,0,0,
    1,0,0,
    1,0,0,
    1,0,0,

    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,

    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1,

    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,

    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    
    0,1,1,
    0,1,1,
    0,1,1,
    0,1,1,
    0,1,1,
    0,1,1,
  ]);
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColor);


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

    // console.log('mvpMatrix.rotate=',mvpMatrix.rotate);
    // // mvpMatrix.rotate


    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(mat, false, mvpMatrix.elements);

    // gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, vm), rotate));
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

    requestAnimationFrame(draw);
  }

  draw();
 
};
