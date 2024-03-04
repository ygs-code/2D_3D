// 引入three.js
import * as THREE from "three";
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
//引入性能监视器stats.js,显示帧率
import Stats from 'three/addons/libs/stats.module.js';
import "./index.less";

window.onload = () => {
      //创建stats对象
    const stats = new Stats();
    //Stats.domElement:web页面上输出计算结果,一个div元素
    document.body.appendChild(stats.domElement);
    /*
      创建3D场景对象 scene
    */ 
   const scene = new THREE.Scene();
   // 创建网格模型
   const geometry = new THREE.BoxGeometry(100,100,100);
   const material = new THREE.MeshLambertMaterial({
    color:0x00ffff,
   });
   const mesh = new THREE.Mesh(geometry,material);
   // 添加到场景中
   scene.add(mesh);

   // 辅助观察者坐标系
   const axesHelper = new THREE.AxesHelper(100);
   scene.add(axesHelper);

   // 光源设置
   const directionalLinght=new THREE.DirectionalLight(0xffffff,0.8);
   directionalLinght.position.set(400,200,300);
   scene.add(directionalLinght);
   const ambient = new THREE.AmbientLight(0xfffffff,0.4);
   scene.add(ambient);

   // 相机
   const width = window.innerWidth;
   const height = window.innerHeight;
   const camera = new THREE.PerspectiveCamera(30,width/height,1,3000);

   camera.position.set(292,223,185);
   camera.lookAt(0,0,0,);


   // webgl 渲染器设置
   const renderer = new THREE.WebGLRenderer({
     antialias:true   // 开启优化锯齿
   });

   renderer.setSize(
    width,
    height
   );
   document.body.appendChild(renderer.domElement);

  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);


  renderer.setClearColor(0x444444, 1); // 设置背景颜色

  // 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);


// 渲染循环
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();


// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

  


};    
