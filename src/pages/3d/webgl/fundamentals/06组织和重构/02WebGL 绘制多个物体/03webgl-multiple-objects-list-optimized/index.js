import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays , setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/comments/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";




import "./index.less";
// import "@/pages/index.less";
 
 window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 398;
  canvas.height = 298;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");

  function main() {
    // // Get A WebGL context
    // var canvas = document.getElementById("canvas");
    // var gl = getWebGLContext(canvas);
    // if (!gl) {
    //   return;
    // }
  
    var createFlattenedVertices = function(gl, vertices) {
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
  
    var sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
    var cubeBufferInfo   = createFlattenedVertices(gl, primitives.createCubeVertices(20));
    var coneBufferInfo   = createFlattenedVertices(gl, primitives.createTruncatedConeVertices(10, 0, 20, 12, 1, true, false));
  
    var shapes = [
      sphereBufferInfo,
      cubeBufferInfo,
      coneBufferInfo,
    ];
  
 
    // setup GLSL program
    var programInfo = createProgramInfo(gl, [VSHADER_SOURCE, FSHADER_SOURCE]);
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    function emod(x, n) {
      return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
    }
  
  
    var cameraAngleRadians = degToRad(0);
    var fieldOfViewRadians = degToRad(60);
    var cameraHeight = 50;
  
    var objectsToDraw = [];
    var objects = [];
  
    // Make infos for each object for each object.
    var baseHue = rand(0, 360);
    // 创建200个模型
    var numObjects = 200;

    for (var ii = 0; ii < numObjects; ++ii) {
      var object = {
        uniforms: {
          u_colorMult: chroma.hsv(emod(baseHue + rand(0, 120), 360), rand(0.5, 1), rand(0.5, 1)).gl(),
          u_matrix: makeIdentity(),
        },
        translation: [rand(-100, 100), rand(-100, 100), rand(-150, -50)],
        xRotationSpeed: rand(0.8, 1.2),
        yRotationSpeed: rand(0.8, 1.2),
      };
      objects.push(object);
      objectsToDraw.push({
        programInfo: programInfo,
        bufferInfo: shapes[ii % shapes.length],
        uniforms: object.uniforms,
      });
    }
  
    function computeMatrix(viewMatrix, projectionMatrix, translation, xRotation, yRotation) {
      var xRotationMatrix = makeXRotation(xRotation);
      var yRotationMatrix = makeYRotation(yRotation);
      var translationMatrix = makeTranslation(
          translation[0],
          translation[1],
          translation[2]);
      var matrix = makeIdentity();
      matrix = matrixMultiply(matrix, xRotationMatrix);
      matrix = matrixMultiply(matrix, yRotationMatrix);
      var worldMatrix = matrixMultiply(matrix, translationMatrix);
      matrix = matrixMultiply(worldMatrix, viewMatrix);
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
      var projectionMatrix =
          makePerspective(fieldOfViewRadians, aspect, 1, 2000);
  
      // Compute the camera's matrix using look at.
      var cameraPosition = [0, 0, 100];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      var cameraMatrix = makeLookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = makeInverse(cameraMatrix);
  
      // Compute the matrices for each object.
      objects.forEach(function(object) {
        object.uniforms.u_matrix = computeMatrix(
            viewMatrix,
            projectionMatrix,
            object.translation,
            object.xRotationSpeed * time,
            object.yRotationSpeed * time);
      });
  
      // ------ Draw the objects --------
  
      var lastUsedProgramInfo = null;
      var lastUsedBufferInfo = null;
  
      // 循环渲染200个模型
      objectsToDraw.forEach(function(object) {
        var programInfo = object.programInfo;
        var bufferInfo = object.bufferInfo;
        var bindBuffers = false;
  
        if (programInfo !== lastUsedProgramInfo) {
          lastUsedProgramInfo = programInfo;
          gl.useProgram(programInfo.program);
  
          // We have to rebind buffers when changing programs because we
          // only bind buffers the program uses. So if 2 programs use the same
          // bufferInfo but the 1st one uses only positions the when the
          // we switch to the 2nd one some of the attributes will not be on.
          bindBuffers = true;
        }
  
        // Setup all the needed attributes.
        if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
          lastUsedBufferInfo = bufferInfo;
          setBuffersAndAttributes(gl, programInfo.attribSetters, bufferInfo);
        }
  
        // Set the uniforms.
        setUniforms(programInfo.uniformSetters, object.uniforms);
  
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
      });
  
      requestAnimationFrame(drawScene);
    }
  }
  
 
 
  main();
 
 
 };
