上一节，我们使用了requestAnimationFrame参数来获取时间，并处理动画。这一节我们使用three.js自带的Clock类实例的对象来完成时间的处理。

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659259676953-966f2b47-5ea2-410a-90e5-dea0113083f6.gif)

# [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/06-Clock跟踪时间处理动画.html#_1-clock)1 Clock

该对象用于跟踪时间。如果[performance.nowopen in new window](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)可用，则 Clock 对象通过该方法实现，否则回落到使用略欠精准的[Date.nowopen in new window](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/now)来实现。

实例化clock对象，new Clock( autoStart : Boolean )，autoStart — (可选) 是否要在第一次调用 .getDelta() 时自动开启时钟。默认值是 true。

```javascript
// 初始化时钟
const clock = new THREE.Clock();
```





### [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/06-Clock跟踪时间处理动画.html#_1-1-获取运行当前帧的时间)1.1 获取运行当前帧的时间

getElapsedTime ()获取自时钟启动后的秒数。

```javascript
// 设置时钟
const clock = new THREE.Clock();
function render() {
  // 获取时钟运行的总时长
  let time = clock.getElapsedTime();
  console.log("时钟运行总时长：", time);
  

  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
```





























getDelta () 获取2帧之间的时间间隔。

```javascript
// 设置时钟
const clock = new THREE.Clock();
function render() {
  // 获取2帧之间的时间间隔
  let deltaTime = clock.getElapsedTime();
  console.log("2帧之间的时间间隔：", deltaTime);
  

  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
```





























注意：getDelta、getElapsedTime请勿同时用于同一帧，会导致getDelta计时不准。因为每次调用这2个函数，都会对oldTime属性进行重置，所以getDelta计算出来的就不是上一帧的时间。

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/06-Clock跟踪时间处理动画.html#_2-综合上述代码)2 综合上述代码

1、在前面创建的项目中的main.js文件写入代码，实现每5秒，即从原点出发匀速在x轴进行1m/s的匀速运动

```javascript
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// console.log(THREE);

// 目标：Clock该对象用于跟踪时间

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 修改物体的位置
// cube.position.set(5, 0, 0);
// cube.position.x = 3;
// 缩放
// cube.scale.set(3, 2, 1);
// cube.scale.x = 5;
// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XZY");

// 将几何体添加到场景中
scene.add(cube);

console.log(cube);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();
function render() {
  // 获取时钟运行的总时长
  let time = clock.getElapsedTime();
  console.log("时钟运行总时长：", time);
  //   let deltaTime = clock.getDelta();
  //     console.log("两次获取时间的间隔时间：", deltaTime);
  let t = time % 5;
  cube.position.x = t * 1;

  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
```





























































































































































效果演示：

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659259676953-966f2b47-5ea2-410a-90e5-dea0113083f6.gif)