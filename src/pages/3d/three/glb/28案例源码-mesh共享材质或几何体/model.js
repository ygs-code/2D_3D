import * as THREE from 'three';


const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const mesh = new THREE.Mesh(geometry, material);

const mesh2 = new THREE.Mesh(geometry, material);
mesh2.position.x = 100;

// 两个mesh共享一个材质，改变一个mesh的颜色，另一个mesh2的颜色也会跟着改变
// mesh.material和mesh2.material都指向同一个material
// 三者等价：mesh.material、mesh2.material、material
mesh.material.color.set(0xffff00);


// 三者等价：mesh.geometry、mesh2.geometry、geometry
mesh.geometry.translate(0,100,0);
export {mesh,mesh2};