// 引入three.js
import * as THREE from 'three';

 // 创建一个几何体对象
 const geometry = new THREE.BufferGeometry();

 //类型顶点数据

 const vertices = new Float32Array([
  0, 0, 0, //顶点1坐标
  80, 0, 0, //顶点2坐标
  80, 80, 0, //顶点3坐标

  0, 0, 0, //顶点4坐标   和顶点1位置相同
  80, 80, 0, //顶点5坐标  和顶点3位置相同
  0, 80, 0, //顶点6坐标
 ]);

// 创建属性缓冲区对象

const attribue = new THREE.BufferAttribute(vertices,3); // 3个为一组
// 设置几何体attribues的位置属性
geometry.attributes.position=attribue;

// 三角形模型
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff, //材质颜色
    // side: THREE.FrontSide, //默认只有正面可见
    // side: THREE.BackSide, //设置只有背面可见
    side: THREE.DoubleSide, //两面可见
});
 
// 网格模型本质：一个一个三角形(面)构成
const line = new THREE.Mesh(geometry, material);

export default line;