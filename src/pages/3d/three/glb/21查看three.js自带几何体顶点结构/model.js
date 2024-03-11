import * as THREE from 'three';

// const geometry = new THREE.BoxGeometry(50,50,50); //长方体
const geometry = new THREE.PlaneGeometry(100,50); //矩形平面几何体

console.log('几何体',geometry);
console.log('顶点位置数据',geometry.attributes.position);
console.log('顶点索引数据',geometry.index);

const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, 
    wireframe:true,//线条模式渲染mesh对应的三角形数据
});
const mesh = new THREE.Mesh(geometry, material); 

export default mesh;