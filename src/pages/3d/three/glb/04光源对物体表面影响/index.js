// 引入three.js
import * as THREE from "three";

import "./index.less";

window.onload = () => {
  // 创建3D场景对Scene 
  const scene = new THREE.Scene();
 /*
  创建网络模型
  // 模型 大小 vertex 顶点
 */
const geometry = new THREE.BoxGeometry(100,100,100);
/*
   材质对象: Material 
   基础网络材质: MeshBasicMaterial 不受光照影响
   漫反射网格材质: MeshLambertMaterial
*/

// 模型的材质 相当于 fragment
const material = new THREE.MeshLambertMaterial({
  color: 0x00ffff, //设置材质颜色
});

 //网格模型对象Mesh 模型类型
const mesh = new THREE.Mesh(geometry,material);
// 网络模型添加到场景中
scene.add(mesh);

// AxseHelper ： 辅助的坐标系
const axesHlper = new THREE.AxesHelper(100);
scene.add(axesHlper);


 /*
   光源设置 点光源
 */

    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.decay=0.0;

    // 点光源位置
    pointLight.position.set(400,200,300);
    // 点光源添加到场景中
    scene.add(pointLight);

    
 
    const width = 800;
    const height = 500;

    /*
      透视投影相机设置
      30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
    */

      const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
      // 设置相机 位置 eye
      camera.position.set(292, 223, 185);

     // 设置相机观察物体的位置 at
      camera.lookAt(0,0,0);

      // up .up 设置相机拍摄时相机头顶的方向。
      camera.up.set(0, 1, 0);

      const renderer=new THREE.WebGLRenderer();
      //设置three.js渲染区域的尺寸(像素px)
      renderer.setSize(width,height);
       //执行渲染操作
       renderer.render(scene, camera);
      //three.js执行渲染命令会输出一个canvas画布，也就是一个HTML元素，你可以插入到web页面中
      document.body.appendChild(renderer.domElement);
     
};
