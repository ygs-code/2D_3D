// 引入three.js
import * as THREE from 'three';

 // 创建一个几何对象
 const geometry = new THREE.BufferGeometry();
 
 // 类型数组创建顶点数据

 const vertices = new Float32Array([
    0,0,0,  // 顶点1坐标
    50,0,0,  // 顶点2坐标
    0,100,0,  // 顶点3坐标
    0,0,10,  // 顶点4坐标
    0,0,100,  // 顶点5坐标
    50,0,10,  // 顶点6坐标
 ]);

 // 创建属性缓冲区对象
 //3个为一组，表示一个顶点的xyz坐标
 const attribue = new THREE.BufferAttribute(vertices,3);
 // 设置几何体attributes属性的位置属性
 geometry.attributes.position=attribue;

 // 点渲染模式
 const material = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 10.0 //点对象像素尺寸
 });

 // 点模型对象
 const posints = new THREE.Points(geometry,material);
 
 export default posints;