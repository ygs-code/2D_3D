// 引入three.js
import * as THREE from "three";

import "./index.less";

window.onload = () => {
   /*
     创建3d场景对象 Scene 
   */
    const scene= new THREE.Scene();
    // 创建一个长方体几何对象 Geometry
    const geometry  = new THREE.BoxGeometry(50,50,50);
    // 材质对象 Material
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff, //设置材质颜色
       transparent:true,//开启透明
       opacity:0.5,//设置透明度
    });

    const mesh = new THREE.Mesh(geometry,material);

    // 设置网络模型空间位置，默认是原点
    mesh.position.set(0,10,0);
    scene.add(mesh);

    // AxesHelper：辅助观察坐标系
    const axesHlper = new THREE.AxesHelper(100);
    scene.add(axesHlper);

    // width 和 height 用来设置Three.js 输出的Canvas画板尺寸(像素px)
    const width = 800; //宽度
    const height = 500; //高度

    /*
      透视投影相机设置
      30 度 视角 width/height Canvas 画布宽高比， 1:近截面 , 3000:远裁截面

    */
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    //相机在Three.js三维坐标系中的位置
    // .position 设置相机在三维坐标中的位置。  eye
    camera.position.set(292, 223, 185);

    // .lookAt 设置相机拍摄时指向的方向。 at
    camera.lookAt(0, 0, -1);

    // up .up 设置相机拍摄时相机头顶的方向。
    camera.up.set(0, 1, 0);

    const render = new THREE.WebGLRenderer();
    // 设置画布canvas大小
    render.setSize(width, height);
  
    // 执行渲染操作
    render.render(scene, camera);
    // three.js 执行渲染命令
    document.body.appendChild(render.domElement);




};
