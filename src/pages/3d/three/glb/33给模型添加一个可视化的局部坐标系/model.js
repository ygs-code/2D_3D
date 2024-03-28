// 引入three.js
import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(20, 20, 20); 
const material = new THREE.MeshLambertMaterial({
  color: 0x00ffff
}); 
const mesh = new THREE.Mesh(geometry, material); 
mesh.position.set(50, 0, 0);
const group = new THREE.Group();
group.add(mesh); //网格模型添加到组中
group.position.set(50, 0, 0);


// 声明一个三维向量用来表示某个坐标
const worldPosition = new THREE.Vector3();
// 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
mesh.getWorldPosition(worldPosition);
console.log('世界坐标',worldPosition);
console.log('本地坐标',mesh.position);


//可视化mesh的局部坐标系
const meshAxesHelper = new THREE.AxesHelper(50);
mesh.add(meshAxesHelper);

export default group;