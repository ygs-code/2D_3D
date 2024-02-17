import initShaders from "@/pages/3d/utils/initShader";
import * as THREE from "three";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";

 
window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // 创建一个三维场景Scene
  const scene = new THREE.Scene();

  // 创建物体几何定点 定义几个几何体 立方体
  const geometry = new THREE.BoxGeometry( 100, 100, 100 ); 

  // 物体外观 材质
  let material = new THREE.MeshBasicMaterial({
    color:'red'
  });
  // 创建一个网格模型 用来 表示生活中的物体
  const mesh = new THREE.Mesh( geometry, material );

  // 设置 x y z 轴
  mesh.position.set(0,0,0);

  // 将mesh物体添加到场景中
  scene.add( mesh );


console.log('mesh==',mesh);

};
