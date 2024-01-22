import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays , resizeCanvasToDisplaySize ,setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";




import "./index.less";
// import "@/pages/index.less";
 

console.log('m4=======',m4);

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
    /** @type {HTMLCanvasElement} */
    // const canvas = document.getElementById("canvas");
    // const gl = canvas.getContext("webgl");
    // if (!gl) {
    //   return;
    // }
  
    // creates buffers with position, normal, texcoord, and vertex color
    // data for primitives by calling gl.createBuffer, gl.bindBuffer,
    // and gl.bufferData
    const sphereBufferInfo = primitives.createSphereWithVertexColorsBufferInfo(gl, 10, 12, 6);
    const cubeBufferInfo   = primitives.createCubeWithVertexColorsBufferInfo(gl, 20);
    const coneBufferInfo   = primitives.createTruncatedConeWithVertexColorsBufferInfo(gl, 10, 0, 20, 12, 1, true, false);
  
    const shapes = [
      sphereBufferInfo,
      cubeBufferInfo,
      coneBufferInfo,
    ];
 


    // setup GLSL programs
    const programInfo = createProgramInfo(
        gl, [VSHADER_SOURCE, FSHADER_SOURCE]);
    const pickingProgramInfo = createProgramInfo(
        gl, [PICK_VSHADER_SOURCE, PICK_FSHADER_SOURCE]);
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    function eMod(x, n) {
      return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
    }
  
  
    const fieldOfViewRadians = degToRad(60);
  
    const objectsToDraw = [];
    const objects = [];
  
    // Make infos for each object for each object.
    const baseHue = rand(0, 360);
    const numObjects = 200;
    for (let ii = 0; ii < numObjects; ++ii) {
      const id = ii + 1;
      const object = {
        uniforms: {
          u_colorMult: chroma.hsv(eMod(baseHue + rand(0, 120), 360), rand(0.5, 1), rand(0.5, 1)).gl(),
          u_matrix: m4.identity(),
          u_id: [
            ((id >>  0) & 0xFF) / 0xFF,
            ((id >>  8) & 0xFF) / 0xFF,
            ((id >> 16) & 0xFF) / 0xFF,
            ((id >> 24) & 0xFF) / 0xFF,
          ],
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
  
    // Create a texture to render to
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
    // create a depth renderbuffer
    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  
    function setFramebufferAttachmentSizes(width, height) {
      gl.bindTexture(gl.TEXTURE_2D, targetTexture);
      // define size and format of level 0
      const level = 0;
      const internalFormat = gl.RGBA;
      const border = 0;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
      const data = null;
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border,
                    format, type, data);
  
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    }
  
    // Create and bind the framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  
    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    const level = 0;

    console.log('targetTexture====',targetTexture);
    debugger;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
  
    // make a depth buffer and the same size as the targetTexture

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  
    function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
      let matrix = m4.translate(viewProjectionMatrix,
          translation[0],
          translation[1],
          translation[2]);
      matrix = m4.xRotate(matrix, xRotation);
      return m4.yRotate(matrix, yRotation);
    }
  
    requestAnimationFrame(drawScene);
  
    function drawObjects(objectsToDraw, overrideProgramInfo) {
      objectsToDraw.forEach(function(object) {
        const programInfo = overrideProgramInfo || object.programInfo;
        const bufferInfo = object.bufferInfo;
  
        gl.useProgram(programInfo.program);
  
        // Setup all the needed attributes.
        setBuffersAndAttributes(gl, programInfo, bufferInfo);
  
        // Set the uniforms.
        setUniforms(programInfo, object.uniforms);
  
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
      });
    }
  
    // mouseX and mouseY are in CSS display space relative to canvas
    let mouseX = -1;
    let mouseY = -1;
    let oldPickNdx = -1;
    let oldPickColor;
    let frameCount = 0;
  
    // Draw the scene.
    function drawScene(time) {
      time *= 0.0005;
      ++frameCount;
  
      if (resizeCanvasToDisplaySize(gl.canvas)) {
        // the canvas was resized, make the framebuffer attachments match
        setFramebufferAttachmentSizes(gl.canvas.width, gl.canvas.height);
      }
  
      // Compute the projection matrix
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const projectionMatrix =
          m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
  
      // Compute the camera's matrix using look at.
      const cameraPosition = [0, 0, 100];
      const target = [0, 0, 0];
      const up = [0, 1, 0];
      const cameraMatrix = m4.lookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      const viewMatrix = m4.inverse(cameraMatrix);
  
      const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
      // Compute the matrices for each object.
      objects.forEach(function(object) {
        object.uniforms.u_matrix = computeMatrix(
            viewProjectionMatrix,
            object.translation,
            object.xRotationSpeed * time,
            object.yRotationSpeed * time);
      });
  
      // ------ Draw the objects to the texture --------
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      drawObjects(objectsToDraw, pickingProgramInfo);
  
      // ------ Figure out what pixel is under the mouse and read it
  
      const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
      const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;
      const data = new Uint8Array(4);
      gl.readPixels(
          pixelX,            // x
          pixelY,            // y
          1,                 // width
          1,                 // height
          gl.RGBA,           // format
          gl.UNSIGNED_BYTE,  // type
          data);             // typed array to hold result
      const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
  
      // restore the object's color
      if (oldPickNdx >= 0) {
        const object = objects[oldPickNdx];
        object.uniforms.u_colorMult = oldPickColor;
        oldPickNdx = -1;
      }
  
      // highlight object under mouse
      if (id > 0) {
        const pickNdx = id - 1;
        oldPickNdx = pickNdx;
        const object = objects[pickNdx];
        oldPickColor = object.uniforms.u_colorMult;
        object.uniforms.u_colorMult = (frameCount & 0x8) ? [1, 0, 0, 1] : [1, 1, 0, 1];
      }
  
      // ------ Draw the objects to the canvas
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      drawObjects(objectsToDraw);
  
      requestAnimationFrame(drawScene);
    }
  
    gl.canvas.addEventListener('mousemove', (e) => {
       const rect = canvas.getBoundingClientRect();
       mouseX = e.clientX - rect.left;
       mouseY = e.clientY - rect.top;
    });
  }
  
   
 
  main();
 
 
 };
