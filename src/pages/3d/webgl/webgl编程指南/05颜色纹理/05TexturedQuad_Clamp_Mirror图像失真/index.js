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
import {Matrix4}  from "@/pages/3d/utils/lib/cuon-matrix";
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
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Set texture
    if (!initTextures(gl, n)) {
      console.log('Failed to intialize the texture.');
      return;
    }
  }
  
  function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
      // Vertex coordinate, Texture coordinate
      -0.5,  0.5,   -0.3,  1.7,
      -0.5, -0.5,   -0.3, -0.2,
       0.5,  0.5,    1.7,  1.7,
       0.5, -0.5,    1.7, -0.2
    ]);
    var n = 4; // The number of vertices
  
    // Create a buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write the positions of vertices to a vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
  
    // Get the storage location of a_TexCoord
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    if (a_TexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord');
      return -1;
    }
    // Assign the buffer object to a_TexCoord variable
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    // Enable the generic vertex attribute array
    gl.enableVertexAttribArray(a_TexCoord);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return n;
  }
  
  function initTextures(gl, n) {
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
  
    // Get the storage location of u_Sampler
    var u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
    if (!u_Sampler) {
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
  
    // Create the image object
    var image = new Image();
    // Register the event handler to be called when image loading is completed
    image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
    // Tell the browser to load an Image
    image.src = sky;
  
    return true;
  }
  
  function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
    // Activate texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Set the image to texture
    // 将图像设置为纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);
    
    gl.clear(gl.COLOR_BUFFER_BIT);  // Clear <canvas>
  
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);  // Draw the rectangle
  }
  

main(); 
};
