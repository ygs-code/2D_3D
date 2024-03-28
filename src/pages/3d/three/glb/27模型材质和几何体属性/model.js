import * as THREE from 'three';


const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const mesh = new THREE.Mesh(geometry, material);
console.log('mesh',mesh);
console.log('mesh.geometry',mesh.geometry);
console.log('mesh.material',mesh.material);

// 访问模型材质,并设置材质的颜色属性
mesh.material.color.set(0xffff00);
// 访问模型几何体,并平移几何体顶点数据
mesh.geometry.translate(0,100,0);
export default mesh;