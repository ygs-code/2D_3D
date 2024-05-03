// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader(); //创建一个GLTF加载器

const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景

loader.load("/static/file/工厂.glb", function (gltf) {
    gltf.scene.traverse(function (obj) {
        if (obj.isMesh) { //判断是否是网格模型
            // obj.material.envMap = textureCube; //设置环境贴图
            obj.material.envMapIntensity = 1.0;
        }
    });
    model.add(gltf.scene);
})
export default model;