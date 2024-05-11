// 引入Three.js
import * as THREE from "three";
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import * as dat from "dat.gui";

const gui = new dat.GUI();

// 创建材质子菜单
const matFolder = gui.addFolder("车外壳材质");
matFolder.close(); //关闭菜单

const loader = new GLTFLoader(); //创建一个GLTF加载器

const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
// 加载环境贴图
const textureCube = new THREE.CubeTextureLoader()
  .setPath("/static/file/环境贴图/环境贴图1/")
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
textureCube.encoding = THREE.sRGBEncoding; //设置纹理贴图编码方式和WebGL渲染器一致
loader.load("/static/file/轿车.glb", function (gltf) {
  model.add(gltf.scene);
  // 车外壳包含多个Mesh，获取其中一个
  const mesh = gltf.scene.getObjectByName("外壳01");
  mesh.material = new THREE.MeshPhysicalMaterial({
    color: mesh.material.color, //默认颜色
    // color: 0x222222,//换一种颜色
    metalness: 0.9, //车外壳金属度
    roughness: 0.5, //车外壳粗糙度
    clearcoat: 1, //清漆层
    clearcoatRoughness: 0.01, //清漆层粗糙度
    envMap: textureCube, //环境贴图
    envMapIntensity: 2.5 //环境贴图对Mesh表面影响程度
  });

  const obj = {
    color: mesh.material.color.getHex() // 获取材质默认颜色
  };
  // 材质颜色color
  matFolder.addColor(obj, "color").onChange(function (value) {
    mesh.material.color.set(value);
  });
  // 范围可以参考文档
  matFolder.add(mesh.material, "metalness", 0, 1);
  matFolder.add(mesh.material, "roughness", 0, 1);
  matFolder.add(mesh.material, "clearcoat", 0, 1);
  matFolder.add(mesh.material, "clearcoatRoughness", 0, 1);
  matFolder.add(mesh.material, "envMapIntensity", 0, 10);
});
export default model;
