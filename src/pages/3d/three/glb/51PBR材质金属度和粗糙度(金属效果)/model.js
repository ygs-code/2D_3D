// 引入Three.js
import * as THREE from "three";
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader(); //创建一个GLTF加载器
const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景

loader.load("/static/file/金属.glb", function (gltf) {
  // 递归遍历所有模型节点批量修改材质
  gltf.scene.traverse(function (obj) {
    if (obj.isMesh) {
      //判断是否是网格模型
      // console.log('obj.material',obj.material);
      // 重新设置材质的金属度和粗糙度属性
      obj.material.metalness = 1.0; //金属度
      obj.material.roughness = 0.5; //表面粗糙度

      // obj.material = new THREE.MeshStandardMaterial({
      //     color: obj.material.color, //读取材质原来的颜色
      //     // 金属度属性metalness：材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0。
      //     // metalness默认0.5,0.0到1.0之间的值可用于生锈的金属外观
      //     metalness: 1.0,
      //     // metalness: 0.0,//没有金属质感
      //     // 粗糙度属性roughness:模型表面粗糙程度,0.0表示平滑的镜面反射,1.0表示完全漫反射,默认0.5
      //     roughness: 0.5,
      //     // roughness: 1.0,//设置到完全漫反射状态，表面金属质感比较弱
      //     // roughness: 0.0,//完全镜面反射，就像一面镜子一样，注意配合环境贴图观察更明显
      // })
    }
  });
  model.add(gltf.scene);
});
export default model;
