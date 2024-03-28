// 引入three.js
import * as THREE from 'three';

//长方体的几何中心默认与本地坐标原点重合
const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshLambertMaterial({color: 0x00ffff});
const mesh = new THREE.Mesh(geometry, material);


// 平移几何体的顶点坐标,改变几何体自身相对局部坐标原点的位置
geometry.translate(50/2,0,0,);

// .rotateY()默认绕几何体中心旋转，经过上面几何体平移变化，你会发现.rotateY()是绕长方体面上一条线旋转
mesh.rotateY(Math.PI/3);


export default mesh;
