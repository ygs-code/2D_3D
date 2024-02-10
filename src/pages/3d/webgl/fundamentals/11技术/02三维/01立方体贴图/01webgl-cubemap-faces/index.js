import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays ,createProgramFromScripts, resizeCanvasToDisplaySize ,setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
// import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
// import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";


 

import "./index.less";
// import "@/pages/index.less";
 

console.log('m4=======',m4);

 window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

 
  function main() {
    // Get A 2D context
    /** @type {Canvas2DRenderingContext} */
    const ctx = canvas.getContext("2d");

    ctx.canvas.width = 128;
    ctx.canvas.height = 128;

    const faceInfos = [
        {faceColor: '#F00', textColor: '#0FF', text: '+X'},
        {faceColor: '#FF0', textColor: '#00F', text: '-X'},
        {faceColor: '#0F0', textColor: '#F0F', text: '+Y'},
        {faceColor: '#0FF', textColor: '#F00', text: '-Y'},
        {faceColor: '#00F', textColor: '#FF0', text: '+Z'},
        {faceColor: '#F0F', textColor: '#0F0', text: '-Z'},
    ];
    faceInfos.forEach((faceInfo) => {
        const {faceColor, textColor, text} = faceInfo;
        generateFace(ctx, faceColor, textColor, text);

        // show the result
        ctx.canvas.toBlob((blob) => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            document.body.appendChild(img);
        });
    });
}

function generateFace(ctx, faceColor, textColor, text) {
    const {width, height} = ctx.canvas;
    ctx.fillStyle = faceColor;
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${width * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(text, width / 2, height / 2);
}
  main();
 
 };
