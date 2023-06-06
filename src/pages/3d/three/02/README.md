## 2. 如何360度的查看立方体

上一节，我们讲解了如何渲染出一个立方体物体，但是不能很好的全方位观看立方体。这个时候可以使用控制控制器，让相机围绕立方体运动，就像地球围绕太阳一样运动，去观察立方体。

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659153850899-51bc49f1-7925-4b26-8530-d645bb6c6c65.gif)

### [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/01-%E8%BD%A8%E9%81%93%E6%8E%A7%E5%88%B6%E5%99%A8%E6%9F%A5%E7%9C%8B%E7%89%A9%E4%BD%93.html#_1-1-%E5%88%9B%E5%BB%BA%E8%BD%A8%E9%81%93%E6%8E%A7%E5%88%B6%E5%99%A8)1.1 创建轨道控制器

```
// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

```

必须传入2个参数：

1. 相机，让哪一个相机围绕目标运动。默认目标是原点。立方体在原点处。
2. 渲染的画布dom对象，用于监听鼠标事件控制相机的围绕运动。

### [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/01-%E8%BD%A8%E9%81%93%E6%8E%A7%E5%88%B6%E5%99%A8%E6%9F%A5%E7%9C%8B%E7%89%A9%E4%BD%93.html#_2-2-%E6%AF%8F%E4%B8%80%E5%B8%A7%E6%A0%B9%E6%8D%AE%E6%8E%A7%E5%88%B6%E5%99%A8%E6%9B%B4%E6%96%B0%E7%94%BB%E9%9D%A2)2.2 每一帧根据控制器更新画面

因为控制器监听鼠标事件之后，要根据鼠标的拖动，来控制相机围绕目标运动，并根据运动之后的效果，显示出画面来。为了保证画面流畅渲染，选择使用请求动画帧requestAnimationFrame，在屏幕渲染下一帧画面时触发回调函数来执行画面的渲染。

```
function render() {
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update()
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

```

#### [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/01-%E8%BD%A8%E9%81%93%E6%8E%A7%E5%88%B6%E5%99%A8%E6%9F%A5%E7%9C%8B%E7%89%A9%E4%BD%93.html#_2-2-1-requestanimationframe)2.2.1 requestAnimationFrame

是HTML5的新特性，区别于setTimeout和setInterval。requestAnimationFrame比后两者精确，采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销。

因此屏幕每一帧都刷新一次画面，就需要执行

```
function render() {
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

```

## [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/01-%E8%BD%A8%E9%81%93%E6%8E%A7%E5%88%B6%E5%99%A8%E6%9F%A5%E7%9C%8B%E7%89%A9%E4%BD%93.html#_2-%E7%BB%BC%E5%90%88%E4%B8%8A%E8%BF%B0%E4%BB%A3%E7%A0%81)2 综合上述代码

1、在前面创建的项目中的main.js文件写入代码

```
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// console.log(THREE);

// 目标：使用控制器查看3d物体

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
// 将几何体添加到场景中
scene.add(cube);

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

function render() {
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

```

效果演示：

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659153850899-51bc49f1-7925-4b26-8530-d645bb6c6c65.gif)