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
    // 创建3d场景
    const scene = new THREE.Scene();

    
    // 创建 网格模型 SphereGeometry 球体
    const geometry = new THREE.SphereGeometry(50);

     // meshBaseicMaterial 不受光照影响
    //  const material = new THREE.MeshBasicMaterial({
    //       color: 0xff0000, 
    //  })
     
     // 漫反射没有镜面反射效果，不会产生局部高光效果
    //  const material = new THREE.MeshLambertMaterial({
    //   color: 0xff0000, 
    //  })

    // 模拟镜面反射，产生一个高光效果
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 20, //高光部分的亮度，默认30
      specular: 0x444444, //高光部分的颜色
    });


    const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中
    
    
    //光源设置
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(400,200,300);

    scene.add(directionalLight);
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // 相机渲染 投影
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(292, 223, 185);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

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
