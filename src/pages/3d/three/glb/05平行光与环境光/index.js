// 引入three.js
import * as THREE from "three";
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import "./index.less";

window.onload = () => {
  
      /*
      创建3d场景对象Scene
      */
      const scene = new THREE.Scene();
      /*
      创建一个网络模型
      */   
      // 创建一个长方几何体对象Geometry
      const geometry = new THREE.BoxGeometry(100,100,100);
      // 漫反射网格材质；MeshLambertMaterial
      const material = new THREE.MeshLambertMaterial({
          color: 0x00ffff, //设置材质颜色
      });
      const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      scene.add(mesh); //网格模型添加到场景中

      // AxesHelper：辅助观察的坐标系
      const axesHelper = new THREE.AxesHelper(100);
      scene.add(axesHelper);

      /**
       * 光源设置
       */
      //点光源
      // const pointLight = new THREE.PointLight(0xffffff, 1.0);
      // pointLight.decay=0.0;
      // //点光源位置
      // // pointLight.position.set(400, 0, 0);//点光源放在x轴上
      // pointLight.position.set(400, 200, 300);//偏移光源位置，观察渲染效果变化
      // scene.add(pointLight); //点光源添加到场景中

      // 环境光会均匀的照亮场景中的所有物体
      const ambient =  new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambient);

      // 平行光
      const directionalLight= new THREE.DirectionalLight(0xffffff, 1);
      // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
      directionalLight.position.set(100, 60, 50);
      // 设置光源的方向，通过光源postion属性和目标指向对象的position属性计算
      scene.add(directionalLight);


      // DirectionalLightHelper：可视化平行光
      const  dirLightHelper = new THREE.DirectionalLightHelper(
        directionalLight, 5,0xff0000
      );
      scene.add(dirLightHelper);



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
      

      // 设置相机控件轨道控制器OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
      //监听鼠标、键盘事件
      controls.addEventListener('change', function () {
          renderer.render(scene, camera); //执行渲染操作
          // 浏览器控制台查看相机位置变化
          console.log('camera.position',camera.position);
      });


      


};
