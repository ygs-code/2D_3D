// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader(); //创建一个GLTF加载器

const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
 
loader.load("/static/file/简易小区.glb", function (gltf) {
    // console.log('控制台查看gltf对象结构', gltf);
    console.log('场景3D模型树结构', gltf.scene);


    // 返回名.name为"1号楼"对应的对象
    const nameNode = gltf.scene.getObjectByName("1号楼");
    nameNode.material.color.set(0xff0000);//改变1号楼Mesh材质颜色

   //获得所有'洋房'房子的父对象
    const obj = gltf.scene.getObjectByName('洋房');
    console.log('obj', obj); //控制台查看返回结果
    console.log('obj.children', obj.children); 
    // obj的所有子对象.children都是Mesh，改变Mesh对应颜色
    obj.children.forEach(function (mesh) {
        mesh.material.color.set(0xffff00);
    });



    model.add(gltf.scene); //三维场景添加到model组对象中
});

export default model;