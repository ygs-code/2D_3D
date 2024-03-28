import * as THREE from 'three';


const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const mesh = new THREE.Mesh(geometry, material);

const v1 = new THREE.Vector3(1, 2, 3);
console.log('v1',v1);
//v2是一个新的Vector3对象，和v1的.x、.y、.z属性值一样
const v2 = v1.clone();
console.log('v2',v2);

const v3 = new THREE.Vector3(4, 5, 6);
//读取v1.x、v1.y、v1.z的赋值给v3.x、v3.y、v3.z
v3.copy(v1);

// const mesh2 = new THREE.Mesh(geometry, material);
// mesh2.position.x = 100;

// 通过mesh克隆.clone()一个和mesh一样的新模型对象mesh2
const mesh2 = mesh.clone();
mesh2.position.x = 100;

// 通过克隆.clone()获得的新模型和原来的模型共享材质和几何体
//改变材质颜色，或者说改变mesh2颜色，mesh和mesh2颜色都会改变
// material.color.set(0xffff00);
mesh2.material.color.set(0xffff00);

// 克隆几何体和材质，重新设置mesh2的材质和几何体属性
mesh2.geometry = mesh.geometry.clone();
mesh2.material = mesh.material.clone();
// 改变mesh2颜色，不会改变mesh的颜色
mesh2.material.color.set(0xff0000);

// 改变mesh的位置，使之位于mesh2的正上方(y)，距离100。
mesh.position.copy(mesh2.position);//1. 第1步位置重合
mesh.position.y += 100;//1. 第2步mesh在原来y的基础上增加100

export {mesh,mesh2};