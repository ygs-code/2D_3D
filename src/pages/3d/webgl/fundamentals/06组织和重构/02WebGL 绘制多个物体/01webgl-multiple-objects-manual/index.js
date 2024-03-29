import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays , setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
 
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import {makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";

import "./index.less";
// import "@/pages/index.less";
 
 window.onload = function () {
   

 
  function main() {
    const canvas = document.createElement("canvas");
    canvas.width = 398;
    canvas.height = 298;
    // getWebGLContext(canvas);
    document.body.appendChild(canvas);
  
    if (!canvas.getContext) return;
    let gl = canvas.getContext("webgl");
    // Get A WebGL context
    // var canvas = document.getElementById("canvas");
    // var gl = getWebGLContext(canvas);
    // if (!gl) {
    //   return;
    // }
  
    var createFlattenedVertices = function(gl, vertices) {
      // 创建定点
      return createBufferInfoFromArrays(
          gl,
          primitives.makeRandomVertexColors(
              primitives.deindexVertices(vertices),
              {
                vertsPerColor: 6,
                rand: function(ndx, channel) {
                  return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
                }
              })
        );
    };
  
    // 创建buffer
    var sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
    var cubeBufferInfo   = createFlattenedVertices(gl, primitives.createCubeVertices(20));
    var coneBufferInfo   = createFlattenedVertices(gl, primitives.createTruncatedConeVertices(10, 0, 20, 12, 1, true, false));
   
  

    // setup GLSL program
    // 创建 program
    var programInfo = createProgramInfo(gl, [VSHADER_SOURCE,FSHADER_SOURCE ]);
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    var cameraAngleRadians = degToRad(0);
    var fieldOfViewRadians = degToRad(60);
    var cameraHeight = 50;
  
    // Uniforms for each object.
    var sphereUniforms = {
      u_colorMult: [0.5, 1, 0.5, 1],
      // 创建 单位矩阵
      u_matrix: makeIdentity(),
    };
    var cubeUniforms = {
      u_colorMult: [1, 0.5, 0.5, 1],
       // 创建 单位矩阵
      u_matrix: makeIdentity(),
    };
    var coneUniforms = {
      u_colorMult: [0.5, 0.5, 1, 1],
       // 创建 单位矩阵
      u_matrix: makeIdentity(),
    };
    var sphereTranslation = [  0, 0, 0];
    var cubeTranslation   = [-40, 0, 0];
    var coneTranslation   = [ 40, 0, 0];
  
    function computeMatrix(viewMatrix, projectionMatrix, translation, xRotation, yRotation) {

        // x 轴旋转
      var xRotationMatrix = makeXRotation(xRotation);
      // y 轴旋转
      var yRotationMatrix = makeYRotation(yRotation);

        // y 偏移
      var translationMatrix = makeTranslation(
          translation[0],
          translation[1],
          translation[2]);
      // 创建初始化矩阵  
      var matrix = makeIdentity();
        // 矩阵相乘 x轴 旋转
      matrix = matrixMultiply(matrix, xRotationMatrix);
       // 矩阵相乘 y轴旋转
      matrix = matrixMultiply(matrix, yRotationMatrix);
         // 矩阵相乘  偏移矩阵
      var worldMatrix = matrixMultiply(matrix, translationMatrix);
         // 矩阵相乘  视图矩阵
      matrix = matrixMultiply(worldMatrix, viewMatrix);
         // 矩阵相乘  透视投影矩阵
      return matrixMultiply(matrix, projectionMatrix);
    }
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(time) {
      time *= 0.0005;
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Compute the projection matrix
      var aspect = canvas.clientWidth / canvas.clientHeight;
      // 投影 透视
      var projectionMatrix =   makePerspective(fieldOfViewRadians, aspect, 1, 2000);
  
      // Compute the camera's matrix using look at.
      var cameraPosition = [0, 0, 100];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      // 相机
      var cameraMatrix = makeLookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      // 从相机矩阵中创建一个视图矩阵。
      var viewMatrix = makeInverse(cameraMatrix);
  
      var sphereXRotation =  time;
      var sphereYRotation =  time;
      var cubeXRotation   = -time;
      var cubeYRotation   =  time;
      var coneXRotation   =  time;
      var coneYRotation   = -time;
  
      // ------ Draw the sphere --------
  
      gl.useProgram(programInfo.program);
  
      // Setup all the needed attributes.
      // 设置所有需要的属性。
      setBuffersAndAttributes(gl, programInfo.attribSetters, sphereBufferInfo);
  
      sphereUniforms.u_matrix = computeMatrix(
          viewMatrix,
          projectionMatrix,
          sphereTranslation,
          sphereXRotation,
          sphereYRotation
      );
  
      // Set the uniforms we just computed
      setUniforms(programInfo.uniformSetters, sphereUniforms);
      // 渲染模型1
      gl.drawArrays(gl.TRIANGLES, 0, sphereBufferInfo.numElements);
  
      // ------ Draw the cube --------
  
      // Setup all the needed attributes.
      setBuffersAndAttributes(gl, programInfo.attribSetters, cubeBufferInfo);
  
      cubeUniforms.u_matrix = computeMatrix(
          viewMatrix,
          projectionMatrix,
          cubeTranslation,
          cubeXRotation,
          cubeYRotation);
  
      // Set the uniforms we just computed
      setUniforms(programInfo.uniformSetters, cubeUniforms);
   // 渲染模型2
      gl.drawArrays(gl.TRIANGLES, 0, cubeBufferInfo.numElements);
  
      // ------ Draw the cone --------
  
      // Setup all the needed attributes.
      setBuffersAndAttributes(gl, programInfo.attribSetters, coneBufferInfo);
  
      coneUniforms.u_matrix = computeMatrix(
          viewMatrix,
          projectionMatrix,
          coneTranslation,
          coneXRotation,
          coneYRotation);
  
      // Set the uniforms we just computed
      setUniforms(programInfo.uniformSetters, coneUniforms);
  
         // 渲染模型3
      gl.drawArrays(gl.TRIANGLES, 0, coneBufferInfo.numElements);
  
      requestAnimationFrame(drawScene);
    }
  }
  
 
 
  main();
 
 
 };
