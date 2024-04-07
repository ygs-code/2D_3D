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

const textureCube = new THREE.CubeTextureLoader()
    // .setPath('../../环境贴图/环境贴图0/')
    .setPath('/static/file/环境贴图/环境贴图3/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
textureCube.encoding = THREE.sRGBEncoding;//和renderer.outputEncoding一致
// 环境贴图纹理对象textureCube作为.environment属性值,影响所有模型
scene.environment = textureCube;

//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


//光源设置
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(400, 200, 300);
// scene.add(directionalLight);
// const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// scene.add(ambient);


//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(100, 100,100);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({
    antialias:true,//抗锯齿
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
renderer.outputEncoding = THREE.sRGBEncoding;

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
