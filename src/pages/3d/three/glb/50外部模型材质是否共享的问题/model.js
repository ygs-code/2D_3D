// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader(); //创建一个GLTF加载器
const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
 
loader.load('/static/file/简易小区-共享材质.glb', function (gltf) { 
    const mesh1 = gltf.scene.getObjectByName("1号楼");
    //1. 改变1号楼Mesh材质颜色
    // 由于不同的Mesh共享了1号楼Mesh的材质，当你mesh1.material改变mesh1材质，本质上是改变所有楼Mesh的材质
    // mesh1.material.color.set(0xff0000);

    //2. 通过.name标记材质，测试mesh1和mesh2是否共享了材质
    mesh1.material.name = '楼房材质';//通过name标记mesh1对应材质
    const mesh2 = gltf.scene.getObjectByName("2号楼");
    //通过name相同，可以判断mesh1.material和mesh2.material共享了同一个材质对象
    console.log('mesh2.material.name', mesh2.material.name);

    //3. 用代码方式解决mesh共享材质问题
    gltf.scene.getObjectByName("小区房子").traverse(function (obj) {
        if (obj.isMesh) {
            // .material.clone()返回一个新材质对象，和原来一样，重新赋值给.material属性
            obj.material = obj.material.clone();
        }
    });
    mesh1.material.color.set(0xffff00);
    mesh2.material.color.set(0x00ff00);

    model.add(gltf.scene);
});


export default model;


 