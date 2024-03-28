// 引入three.js
import * as THREE from 'three';

// 创建一个层级模型对象

//创建两个网格模型mesh1、mesh2
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshLambertMaterial({color: 0x00ffff});
const group = new THREE.Group();
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.translateX(25);

//把mesh1型插入到组group中，mesh1作为group的子对象
group.add(mesh1);
//把mesh2型插入到组group中，mesh2作为group的子对象
group.add(mesh2);



//沿着Y轴平移mesh1和mesh2的父对象，mesh1和mesh2跟着平移
group.translateY(100);
//父对象缩放，子对象跟着缩放
group.scale.set(4,4,4);
//父对象旋转，子对象跟着旋转
group.rotateY(Math.PI/6);

// group也会作为场景scene的子对象插入到场景中
export default group;
