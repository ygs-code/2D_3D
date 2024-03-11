// 引入three.js
import * as THREE from 'three';
 
const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
//类型数组创建顶点数据
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标
    0, 0, 0, //顶点4坐标   和顶点1位置相同
    80, 80, 0, //顶点5坐标  和顶点3位置相同
    0, 80, 0, //顶点6坐标
]);




// 创建属性缓冲区对象
const attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

 
// 每个顶点的法线数据和顶点位置数据一一对应
const normals = new Float32Array([
  0, 0, 1, //顶点1法线( 法向量 )
  0, 0, 1, //顶点2法线
  0, 0, 1, //顶点3法线
  0, 0, 1, //顶点4法线
  0, 0, 1, //顶点5法线
  0, 0, 1, //顶点6法线
]);
// 设置几何体的顶点法线属性.attributes.normal
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的法线数据



// 索引数据赋值给几何体的index属性
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff, 
  // side: THREE.FrontSide, //默认只有正面可见
  // side: THREE.BackSide, //设置只有背面可见
  side: THREE.DoubleSide, //两面可见
});
// 网格模型本质：一个一个三角形(面)构成
const mesh = new THREE.Mesh(geometry, material);

export default mesh;