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

 
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }
 
  function main() {
 
  
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
    // 法线矩阵
    var u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    if (!u_MvpMatrix || !u_NormalMatrix) {
      console.log('Failed to get the storage location');
      return;
    }
  
    // Calculate the view projection matrix
    // 创建视图矩阵
    var viewProjMatrix = new Matrix4();
    // 透视投影
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    // 相机设置
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  
    // Register the event handler to be called when keys are pressed
    //注册按下键时调用的事件处理程序
    document.onkeydown = function(ev){
      // 按下键盘控制
       keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
      };
  
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);  // Draw the robot arm
  }
  
  // 旋转角度的增量(度)
  var ANGLE_STEP = 3.0;    // The increments of rotation angle (degrees)
  // arm1的旋转角度(度)
  var g_arm1Angle = -90.0; // The rotation angle of arm1 (degrees)
  // 关节t1的旋转角度(度)
  var g_joint1Angle = 0.0; // The rotation angle of joint1 (degrees)
  
  function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    switch (ev.keyCode) {
      
      case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
      // 向上箭头键->关节t1围绕z轴的正旋转
        if (g_joint1Angle < 135.0){
          g_joint1Angle += ANGLE_STEP;
        } 
        break;

      case 40: 
      // Down arrow key -> the negative rotation of joint1 around the z-axis
      //向下箭头键-> joint1绕z轴负旋转
        if (g_joint1Angle > -135.0){
          g_joint1Angle -= ANGLE_STEP;
        }
        break;
      case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
        //右箭头键-> arm1绕y轴正旋转
        g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
        break;
      case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
      //左箭头键-> arm1绕y轴负旋转
        g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
        break;
        //在没有有效动作时跳过绘图
      default: return; // Skip drawing at no effective action
    }
    // Draw the robot arm
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  }
  
  function initVertexBuffers(gl) {
    //顶点坐标(宽3.0，高10.0，长3.0，原点在底部中心的长方体)
    // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
    var vertices = new Float32Array([
      1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
      1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
      1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
     -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
     -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
      1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
    ]);
  
    // Normal 法向量
    var normals = new Float32Array([
      0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);
  
    // Indices of the vertices  //顶点的索引
    var indices = new Uint8Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);
  
    // Write the vertex property to buffers (coordinates and normals) //写入顶点属性到缓冲区(坐标和法线)
    if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;
  
    // Unbind the buffer object //取消绑定buffer对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Write the indices to the buffer object //将索引写入buffer对象
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return indices.length;
  }
  
  function initArrayBuffer(gl, attribute, data, type, num) {
    // Create a buffer object  //创建一个buffer对象
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    } 
    // Write data into the buffer object
    //向buffer对象写入数据
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
    // Assign the buffer object to the attribute variable
    //将缓冲区对象赋值给属性变量
    var a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    //启用缓冲区对象对属性变量的赋值
    gl.enableVertexAttribArray(a_attribute);
  
    return true;
  }
  
  // Coordinate transformation matrix
  //坐标变换矩阵
  // 模型结矩阵
  var g_modelMatrix = new Matrix4(),
  // mvp矩阵
  g_mvpMatrix = new Matrix4();
  
  function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Arm1
    var arm1Length = 10.0; // Length of arm1
    // 偏移
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    // 旋转 y 轴
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);    // Rotate around the y-axis

    // 画一个模型 所以第一个模型只有旋转 y 轴
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  

    /*
    模型顺序很重要
    
    
    */
    // Arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0);  // Move to joint1
    // 旋转 z 轴
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
    g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker
   // 画第二模型 第二个模型有选择y轴和z轴功能
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  
  // 法线的坐标变换矩阵
  var g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals
  
  // Draw the cube //绘制立方体
  function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {

    //计算模型视图项目矩阵并将其传递给u_MvpMatrix
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

    //计算法向变换矩阵并传递给u_NormalMatrix
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    // 逆矩阵
    g_normalMatrix.setInverseOf(g_modelMatrix);
    //  转 置 矩阵
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // Draw 渲染两次
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }
  
main(); 
};
