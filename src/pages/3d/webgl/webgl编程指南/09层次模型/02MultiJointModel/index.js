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
    //获取统一变量的存储位置
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    if (!u_MvpMatrix || !u_NormalMatrix) {
      console.log('Failed to get the storage location');
      return;
    }
  
    // Calculate the view projection matrix
    // 视图矩阵
    var viewProjMatrix = new Matrix4();
    // 透视投影
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    // 设置相机
    viewProjMatrix.lookAt(
       
       0.0, 0.0, 40.0,   //  eye   // z 轴 弄远一点
       0.0, 0.0, -1.0,   //  at
       0.0, 1.0, 0.0   // up
       );
  
    // Register the event handler to be called on key press
    //注册按键时调用的事件处理程序
    document.onkeydown = function(ev){
       // 
       keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    };
  
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw the robot arm
  }
  
  // 旋转角度的增量(度)
  var ANGLE_STEP = 3.0;     // The increments of rotation angle (degrees)
  // arm1的旋转角度(度)
  var g_arm1Angle = 0.0;   // The rotation angle of arm1 (degrees)

  // 关节t1的旋转角度(度)
  var g_joint1Angle = 0.0; // The rotation angle of joint1 (degrees)

  // 关节t2的旋转角度(度)
  var g_joint2Angle = 0.0;  // The rotation angle of joint2 (degrees)

  // 关节旋转角度t3(度)
  var g_joint3Angle = 0.0;  // The rotation angle of joint3 (degrees)
  
  function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    
    switch (ev.keyCode) {
      case 40:
         // Up arrow key -> the positive rotation of joint1 around the z-axis
        // 向上箭头键->关节t1围绕z轴的正旋转
        if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
        break;
      case 38: 
      // Down arrow key -> the negative rotation of joint1 around the z-axis
      //向下箭头键-> joint1绕z轴负旋转
        if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
        break;
      case 39: 
       // Right arrow key -> the positive rotation of arm1 around the y-axis
       //右箭头键-> arm1绕y轴正旋转
        g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
        break;
      case 37:
        // Left arrow key -> the negative rotation of arm1 around the y-axis
        //左箭头键-> arm1绕y轴负旋转
        g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
        break;
      case 90: 
        // 'ｚ'key -> the positive rotation of joint2
        // 'z'键->关节的正旋转
        g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
        break; 
      case 88: 
        // 'x'key -> the negative rotation of joint2
        // 'x'键->关节的负旋转
        g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
        break;
      case 86:
         // 'v'key -> the positive rotation of joint3
        //  'v'键->关节3的正旋转
        if (g_joint3Angle < 60.0)  g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
        break;
      case 67:
        // 'c'key -> the nagative rotation of joint3
        // 'c'键->关节的负旋转
        if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
        break;
         //在没有有效动作时跳过绘图
      default: return; // Skip drawing at no effective action
    }
    // Draw the robot arm
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  }
  
  function initVertexBuffers(gl) {
    // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
    //坐标(边长为1，原点在底部中心的立方体)
    var vertices = new Float32Array([
      0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
      0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
      0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
     -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
     -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
      0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);
  
    // Normal  法向量
    var normals = new Float32Array([
      0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);
  
    // Indices of the vertices 顶点的指标
    var indices = new Uint8Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);
  
    // Write the vertex property to buffers (coordinates and normals)
    //写入顶点属性到缓冲区(坐标和法线)
    if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;
  
    // Unbind the buffer object
    //取消绑定buffer对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Write the indices to the buffer object
    // 创建buffer
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    // 绑定buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   // 绑定buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return   indices.length;
  }
  
  function initArrayBuffer(gl, attribute, data, type, num) {
    // Create a buffer object
    // 创建buffer
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
    gl.enableVertexAttribArray(a_attribute);
  
    return true;
  }
  
  // Coordinate transformation 
  // 创建模型矩阵
  var g_modelMatrix = new Matrix4(), 
  // 创建mvp矩阵
  g_mvpMatrix = new Matrix4();
  




  function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    /*
             +1
 
                   +1             
    
   -1                   +1
        
        -1  

             -1 
    
    */
    // Draw a base
    //绘制一个底 高度
    var baseHeight = 2.0;
    // 偏移 y 轴 到 12
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
     //         顶点个数     x        y         z      透视投影           mvp矩阵=模型*视图矩阵     法向量矩阵
    drawBox(gl, n,          10.0, baseHeight,  10.0,   viewProjMatrix,  u_MvpMatrix,             u_NormalMatrix);
   
 
    // Arm1 高度
    var arm1Length = 10.0;
    // 偏移  y 轴 到 2
    g_modelMatrix.translate(0.0, baseHeight, 0.0);     // Move onto the base

     // 旋转 y 轴
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    //             x      y         z
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw




    // Arm2  高度
    var arm2Length = 10.0;
    // 偏移 y 轴
    g_modelMatrix.translate(0.0, arm1Length, 0.0);       // Move to joint1
    // 旋转 z 轴 
    g_modelMatrix.rotate(g_joint1Angle, 1.0, 0.0, 0.0);  // Rotate around the z-axis
    //             x       y        z 
    drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  

    // let a=true;
    // if(a){
    //   return  false; 
    // }


    // A palm
    var palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0);       // Move to palm
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    //              x       y       z
    drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);  // Draw
  
    // Move to the center of the tip of the palm
    g_modelMatrix.translate(0.0, palmLength, 0.0);
  
    // Draw finger1
    pushMatrix(g_modelMatrix);
      g_modelMatrix.translate(0.0, 0.0, 2.0);
      g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
      drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    g_modelMatrix = popMatrix();
  
    // Draw finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  }
  
  var g_matrixStack = []; // Array for storing a matrix
  // 绘制矩形实体
  function pushMatrix(m) { // Store the specified matrix to the array
    // 浅拷贝
    var m2 = new Matrix4(m);
    g_matrixStack.push(m2);
  }
  
  function popMatrix() { 
    // Retrieve the matrix from the array
    // 从数组中检索矩阵
    return g_matrixStack.pop();
  }
  
  var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals
  
  // Draw rectangular 
  // 绘制矩形实体
  function drawBox(
        gl,
        n,  // 顶点个数
        width,   // x
        height,   // y
        depth,  // z 
        viewProjMatrix,  // 视图矩阵 
        u_MvpMatrix,  // mvp矩阵=模型*视图矩阵 
        u_NormalMatrix  // 法向量
      ) {
    // 保存模型矩阵
     pushMatrix(g_modelMatrix);   // Save the model matrix
      // Scale a cube and draw
      //按比例绘制立方体 缩放  x    y       z 
      g_modelMatrix.scale(width, height, depth);

      // Calculate the model view project matrix and pass it to u_MvpMatrix
      //计算模型视图项目矩阵并将其传递给u_MvpMatrix
      /*
      新的矩阵1 = 模型矩阵 * 顶点       mvp 
      新的矩阵2 = 视图矩阵 * 新的矩阵1   mvp 
      */  
      g_mvpMatrix.set(viewProjMatrix);
      g_mvpMatrix.multiply(g_modelMatrix);

      gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

      //计算法向变换矩阵并传递给u_NormalMatrix
      // Calculate the normal transformation matrix and pass it to u_NormalMatrix
      // 逆矩阵 法向量矩阵1 = 逆矩阵 * 模型矩阵
      // 转置   法向量矩阵2 = 转置矩阵 * 法向量矩阵1
      g_normalMatrix.setInverseOf(g_modelMatrix);
      // 转置矩阵
      g_normalMatrix.transpose();

        /*
          模型 矩阵 逆矩阵
          转置矩阵  这样做法是为啦 让 模型变动的时候  法向量 得到纠正

          法线矩阵 = 转置矩阵 * (逆矩阵 * 模型矩阵)  这样做的目的为了矫正法向量 不正确问题
      */ 


      gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
      // Draw 绘制
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    g_modelMatrix = popMatrix();   // Retrieve the model matrix 检索模型矩阵
  }
   
main(); 
};
