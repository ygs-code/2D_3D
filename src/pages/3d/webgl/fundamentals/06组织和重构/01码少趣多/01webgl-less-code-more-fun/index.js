import initShaders from "@/pages/3d/utils/initShader";
import {createProgramFromSources,setAttributes,createAttributeSetters, createUniformSetters,createBufferInfoFromArrays , setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import * as textureUtils from  "@/pages/3d/utils/texture-utils";
import  chroma from  "@/pages/3d/utils/chroma.min";
import {makeTranspose,makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";


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
    // Get A WebGL context
    // var canvas = document.getElementById("canvas");
    // var gl = getWebGLContext(canvas);
    // if (!gl) {
    //   return;
    // }
  
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
  
    //
    var buffers = primitives.createSphereBuffers(gl, 10, 48, 24);
  
    // setup GLSL program
    var program = createProgramFromSources(gl, [VSHADER_SOURCE, FSHADER_SOURCE]);

    var uniformSetters = createUniformSetters(gl, program);
    var attribSetters  = createAttributeSetters(gl, program);
  
    var attribs = {
      a_position: {buffer: buffers.position, numComponents: 3,},
      a_normal:   {buffer: buffers.normal,   numComponents: 3,},
      a_texcoord: {buffer: buffers.texcoord, numComponents: 2,},
    };
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    var cameraAngleRadians = degToRad(0);
    var fieldOfViewRadians = degToRad(60);
    var cameraHeight = 50;
  
    var uniformsThatAreTheSameForAllObjects = {
      u_lightWorldPos:         [-50, 30, 100],
      u_viewInverse:           makeIdentity(),
      u_lightColor:            [1, 1, 1, 1],
    };
  
    var uniformsThatAreComputedForEachObject = {
      u_worldViewProjection:   makeIdentity(),
      u_world:                 makeIdentity(),
      u_worldInverseTranspose: makeIdentity(),
    };
  
    var rand = function(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + Math.random() * (max - min);
    };
  
    var randInt = function(range) {
      return Math.floor(Math.random() * range);
    };
  
    var textures = [
      textureUtils.makeStripeTexture(gl, {color1: "#FFF", color2: "#CCC",}),
      textureUtils.makeCheckerTexture(gl, {color1: "#FFF", color2: "#CCC",}),
      textureUtils.makeCircleTexture(gl, {color1: "#FFF", color2: "#CCC",}),
    ];
  
    var objects = [];
    var numObjects = 300;
    var baseColor = rand(240);
    for (var ii = 0; ii < numObjects; ++ii) {
      objects.push({
        radius: rand(150),
        xRotation: rand(Math.PI * 2),
        yRotation: rand(Math.PI),
        materialUniforms: {
          u_colorMult:             chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl(),
          u_diffuse:               textures[randInt(textures.length)],
          u_specular:              [1, 1, 1, 1],
          u_shininess:             rand(500),
          u_specularFactor:        rand(1),
        },
      });
    }
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(time) {
      time *= 0.0001;
  
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
      var cameraMatrix = makeLookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = makeInverse(cameraMatrix);
  
      gl.useProgram(program);
      // Setup all the needed attributes.
      setAttributes(attribSetters, attribs);
  
      // Bind the indices.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
      // Set the uniforms that are the same for all objects.
      setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects);
  
      // Draw objects
      objects.forEach(function(object) {
  
        // Compute a position for this object based on the time.
        var xRotationMatrix = makeXRotation(object.xRotation * time);
        var yRotationMatrix = makeYRotation(object.yRotation * time);
        var translationMatrix = makeTranslation(0, 0, object.radius);
        var matrix = matrixMultiply(xRotationMatrix, yRotationMatrix);
        var worldMatrix = matrixMultiply(translationMatrix, matrix,
            uniformsThatAreComputedForEachObject.u_world);
  
        // Multiply the matrices.
        var matrix1 = matrixMultiply(worldMatrix, viewMatrix);
        matrixMultiply(matrix1, projectionMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
        makeTranspose(makeInverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);
  
        // Set the uniforms we just computed
        setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);
  
        // Set the uniforms that are specific to the this object.
        setUniforms(uniformSetters, object.materialUniforms);
  
        // Draw the geometry.
        gl.drawElements(gl.TRIANGLES, buffers.numElements, gl.UNSIGNED_SHORT, 0);
      });
  
      requestAnimationFrame(drawScene);
    }
  }
  
 
 
  main();
 
 
 };
