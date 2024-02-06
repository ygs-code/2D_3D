import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
import {fData} from "./data";
 
 
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
// import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import "./index.less";
// import "@/pages/index.less";
 
const {mat4}   = glMatrix; 
// 帖子 https://www.jianshu.com/p/5625ed0a684b
window.onload = function () {
  debugger;
  const canvas = document.createElement("canvas");
  canvas.width = 398;
  canvas.height = 298;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader
 
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }
    

  
  var triangleBuffer = null;

  var perspectiveProjectionMatrix = null;
  var cameraMatrix = null;
  var modelMatrix1 = null;
  var modelMatrix2 = null;
  
  // 创建 Buffer
  function makeBuffer() {
    var triangle = [
      -0.5, 0.5, 0.0, 
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      -0.5, 0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0,
    ];
   const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW);
    return buffer;
  }
  

  // 更新矩阵
  function setupMatrix() {

    // 创建投影
    perspectiveProjectionMatrix = mat4.create();

    // 透视投影
    mat4.perspective(perspectiveProjectionMatrix, 90 / 180.0 * Math.PI, canvas.width / canvas.height, 0.1, 1000);
  
    // 创建相机
    cameraMatrix = mat4.create();
    // 设置相机
    mat4.lookAt(cameraMatrix, [0,0,2], [0,0,0], [0,1,0]);
  
    // 创建模型矩阵
    modelMatrix1 = mat4.create();
    // 创建模型矩阵
    modelMatrix2 = mat4.create();
  }
  
  const onWebGLLoad = function () {
    triangleBuffer = makeBuffer();
    setupMatrix();
  };
  // sdaasdf; 
  const onWebGLRender = function render(deltaTime, elapesdTime) {

    debugger;
    // 设置视图窗口
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // 使用程序
    gl.useProgram(program);
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    // 获取 Attrib  positionLoc地址
    let  positionLoc = gl.getAttribLocation(program, 'position');
    // 设置 
    gl.enableVertexAttribArray(positionLoc);
    // 把顶点设置到 gpu显卡中
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 4 * 3, 0);
  
    // 获取  elapsedTime  Uniform 地址
    let   elapsedTimeUniformLoc = gl.getUniformLocation(program, 'elapsedTime');
    gl.uniform1f(elapsedTimeUniformLoc, elapesdTime);
  
    // 保证canvas尺寸改变时，同步投影矩阵的值，你也可以在resize里重新计算，那样会更好。
    // 投影矩阵
    mat4.perspective(perspectiveProjectionMatrix, 90 / 180.0 * Math.PI, canvas.width / canvas.height, 0.1, 1000);
    // 时间戳
    let elapsedTime = new Date().getTime();
    // 
    var varyingFactor = (Math.sin(elapsedTime / 1000) + 1) / 2.0; // 0 ~ 1
    console.lo('varyingFactor=',varyingFactor);
    debugger;
   // 设置相机
    mat4.lookAt(cameraMatrix, [0, 0, 2 * (varyingFactor + 1)], [0, 0, 0], [0, 1, 0]);
  
    // 设置第一个model matrix
    var rotateMatrix = mat4.create();
    var translateMatrix = mat4.create();
    mat4.rotate(rotateMatrix, rotateMatrix, varyingFactor * Math.PI * 2, [0, 1, 0]);
    mat4.translate(translateMatrix, translateMatrix, [-0.7, 0, 0]);
    mat4.multiply(modelMatrix1, translateMatrix, rotateMatrix);
  
    // 设置第二个model matrix
    rotateMatrix = mat4.create();
    translateMatrix = mat4.create();
    mat4.rotate(rotateMatrix, rotateMatrix, varyingFactor * Math.PI * 2, [0, 0, 1]);
    mat4.translate(translateMatrix, translateMatrix, [0.7, 0, 0]);
    mat4.multiply(modelMatrix2, translateMatrix, rotateMatrix);
  
    // 设置投影和观察矩阵
    var projectionMatrixUniformLoc = gl.getUniformLocation(program, 'projectionMatrix');
    gl.uniformMatrix4fv(projectionMatrixUniformLoc, false, perspectiveProjectionMatrix);
    var cameraMatrixUniformLoc = gl.getUniformLocation(program, 'cameraMatrix');
    gl.uniformMatrix4fv(cameraMatrixUniformLoc, false, cameraMatrix);
  
    // 使用不同的model matrix绘制两次物体
    var modelMatrixUniformLoc = gl.getUniformLocation(program, 'modelMatrix');
    gl.uniformMatrix4fv(modelMatrixUniformLoc, false, modelMatrix1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  
    modelMatrixUniformLoc = gl.getUniformLocation(program, 'modelMatrix');
    gl.uniformMatrix4fv(modelMatrixUniformLoc, false, modelMatrix2);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };



  onWebGLLoad();
  onWebGLRender();
};
