// 引入three.js
import * as THREE from "three";
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';
//引入性能监视器stats.js,显示帧率
import Stats from 'three/addons/libs/stats.module.js';
import "./index.less";
import  model  from './model.js';


window.onload = () => {
     
    
//场景
const scene = new THREE.Scene();
scene.add(model); //模型对象添加到场景中


//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


//光源设置
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);


//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
// camera.position.set(200, 200, 200);//第1步：根据场景渲染范围尺寸设置
camera.position.set(-144, 95, 95); //第2步：通过相机控件辅助设置OrbitControls
// camera.lookAt(0, 0, 0);
const 
x = -1.2,
y = -15,
z = 10;//通过OrbitControls辅助设置
// eye
camera.lookAt(x, y, z);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//解决加载gltf格式模型颜色偏差问题
renderer.outputEncoding = THREE.sRGBEncoding;

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
// console.log('controls.target', controls.target);
// 目标
controls.target.set(x, y, z); //与lookAt参数保持一致

controls.update(); //update()函数内会执行camera.lookAt(controls.target)


// 渲染循环
function render() {
    // 渲染循环中不停地打印相机的位置属性，你可以通过相机控件旋转或缩放三维场景，同时通过浏览器控制台观察相机位置变化。
    console.log('camera.position', camera.position);
    // 浏览器控制台查看controls.target变化，辅助设置lookAt参数
    console.log('controls.target', controls.target);
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
