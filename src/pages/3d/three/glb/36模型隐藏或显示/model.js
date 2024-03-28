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

// mesh1.visible =false;// 隐藏一个网格模型，visible的默认值是true

// group.visible =false;// 隐藏一个包含多个模型的组对象group

// mesh1.visible =true;// 使网格模型mesh处于显示状态

// material.visible可以控制是否隐藏该材质对应的模型对象。
// 如果多个模型引用了同一个材质，如果该材质`.visible`设置为false，意味着隐藏绑定该材质的所有模型。
// mesh1.material.visible =false;

export default group;
