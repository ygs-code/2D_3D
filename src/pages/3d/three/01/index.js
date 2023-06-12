import * as THREE from "three";

// console.log(THREE);

// 目标：了解three.js最基本的内容

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75, // fov 视野角度
  window.innerWidth / window.innerHeight, // 长比宽
  0.1, //  近截面
  1000 //  远截面
);

// camera.lookAt(0, 0.1, 0);  //y轴上位置10

// 设置相机位置
camera.position.set(
  0, // x
  0, // y
  4 // z
);
scene.add(camera);

// 添加物体
// 创建几何体
// 创建立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// 材质
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  transparent: true, //开启透明
  opacity: 0.5, //设置透明度
});
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 将几何体添加到场景中
scene.add(cube);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);
