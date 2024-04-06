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
// camera.position.set(292, 223, 185);
camera.position.set(200, 200, 200);//根据渲染范围尺寸数量级设置相机位置
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//解决加载gltf格式模型颜色偏差问题
renderer.outputEncoding = THREE.sRGBEncoding;

// 渲染循环
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();


const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
   
};    
