GSAP 是一个强大的 JavaScript 工具集，让大家秒变动画大佬。**构建适用于所有**主流浏览器的高性能动画。动画 CSS、SVG、画布、React、Vue、WebGL、颜色、字符串、运动路径、通用对象...... JavaScript 可以触摸的任何东西！GSAP 的[ScrollTriggeropen in new window](https://greensock.com/scrolltrigger)插件让您可以用最少的代码创建令人瞠目结舌的滚动动画。

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#_1-安装gsap模块)1 安装GSAP模块

npm install gsap

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#_2-创建动画)2 创建动画

例如，如果html元素创建动画，将 '.box' 类的元素设置1秒时间水平移动 200px 的动画。可以这么编写

```javascript
// 导入动画库
import gsap from "gsap";
gsap.to(".box", { x: 200 })
```







![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659423713472-463e977d-3634-4175-a2c7-c0c1572c0f20.gif)

在three.js中如果我们想要将物体，例如立方体移动设置1秒时间水平移动 200px 的动画。可以这么编写

```javascript
// 导入动画库
import gsap from "gsap";
gsap.to(cube.position, { x: 200 })
```







gsap.to() - 这是最常见的补间类型。是设置当前元素或者变量的状态，到设置的状态的补间动画。所谓的补间动画，就是2个关键帧（即2种物体的状态）有了，框架自带计算出中间某个时刻的状态，从而填补2个状态间，动画的空白时刻，从而实现完整动画。

gsap.to有2个参数，第一个是目标元素或者变量。如果传入的是.box之类的css字符串选择器，GSAP 在后台使用document.querySelectorAll()选中页面的匹配的元素。当第一个目标是对象时，GSAP就会对其属性值进行修改来实现补间动画。

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#_3-gsap设置动画的属性)3 GSAP设置动画的属性

如何是html元素，可以设置的属性有

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659424918937-3a63fb23-b175-42c3-b0e5-9cb260b647c2.png)

对应CSS样式属性

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659424934723-bbbd5b6b-3b2e-4c21-9c41-467cd41dfe2e.png)

下面演示向右水平移动+旋转.box元素的效果

```javascript
gsap.to(".box", { 
  duration: 2,
  x: 200,
  rotation: 360,
});
```











![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659425194366-72fc022a-023f-4faa-ad91-cd8818681cab.gif)

默认情况下，GSAP 将使用 px 和度数进行变换，但您可以使用其他单位，例如 vw、弧度，甚至可以进行自己的 JS 计算或相对值！

例如：

```javascript
x : 200 , // 使用 px 的默认值
x : "+=200" // 相对值
x : '40vw' , // 或者传入一个具有不同单位的字符串以供 GSAP 解析
x : () => window 。innerWidth / 2 , // 你甚至可以使用函数值进行计算！
rotation：360 // 使用默认的度数
rotation：“1.25rad” // 使用弧度
```













如果第一个参数目标不是html元素，也可以是对象。。您可以针对任何对象的任何属性，甚至是您创建的任意属性，如下所示

```javascript
let obj = { myNum: 10, myColor: "red" };
gsap.to(obj, {
  myNum: 200,
  myColor: "blue",
  onUpdate: () => console.log(obj.myNum, obj.myColor)
});
```













这里可以让obj.myNum值从10变化到200，也可以让颜色myColor的值从红色变化到蓝色。每一次更新值的时候，执行onUpdate所设置的回调函数。

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#_4-gsap特殊属性控制动画)4 GSAP特殊属性控制动画

duration：动画持续时间（秒） 默认值：0.5

delay：动画开始前的延迟量（秒）

repeat：动画应该重复多少次。-1为一直重复

yoyo：如果为 true，则每隔一个重复，补间将沿相反方向运行。（像悠悠球一样）默认值：false

ease：控制动画期间的变化率。

onComplete：动画完成时调用的函数

onUpdate：动画值更新时调用的函数

### [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#ease动画属性设置)ease动画属性设置

缓动可能是动作设计中最重要的部分。精心挑选的轻松将为您的动画增添个性并注入活力。

在下面的演示中看看 no ease 和bounce ease 之间的区别！绿色盒子以匀速的速度旋转，而紫色盒子带有“反弹”旋转动画，感觉就不一样。

```javascript
gsap.to(".green", { rotation: 360, duration: 2, ease: "none" });

gsap.to(".purple", { rotation: 360, duration: 2, ease: "bounce.out" });
```







![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659428153698-f0ae5df0-df3b-452b-862d-c9c488153cac.gif)

在引擎内部，“ease”是一种数学计算，用于控制补间期间的变化率。但不用担心，框架会为您做所有的数学计算！您只需坐下来选择最适合我们的动画的效果即可。

对于大多数效果，分为三种类型in、out、inOut。这些控制了轻松过程中的动量。

像这样的 设置ease："power1.out" 是 UI 过渡的最佳选择；它们启动速度很快，这有助于 UI 感觉反应灵敏，然后它们在接近尾声时放松，给人一种自然的摩擦感。

理解ease的最好方法是玩转ease配置的可视化工具！

地址：https://greensock.com/get-started/#greenSockEaseVisualizer

效果：

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659428929479-65619a1e-2345-4926-97a2-8d49bda65ad8.gif)

### [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#staggers交错)Staggers交错

这是我们最喜欢的技巧之一！如果补间有多个目标，您可以轻松地在每个动画的开始之间添加一些交错效果：

```javascript
gsap.from(".box", {
  duration: 2,
  scale: 0.5, 
  opacity: 0, 
  delay: 0.5, 
  stagger: 0.2,
  ease: "elastic", 
  force3D: true
});

document.querySelectorAll(".box").forEach(function(box) {
  box.addEventListener("click", function() {
    gsap.to(".box", {
      duration: 0.5, 
      opacity: 0, 
      y: -100, 
      stagger: 0.1,
      ease: "back.in"
    });
  });
});
```











































![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659430461409-6dc8b4bf-b087-4c72-a219-4c11730b9dbf.gif)

这里stagger设置0.2，即为将.box选中多个元素设置为每隔0.2秒开始运动1个元素实现效果。

### [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#时间线-timelines)时间线-Timelines

时间线是创建易于调整、有弹性的动画序列的关键。当您将补间添加到时间线时，默认情况下，它们会按照添加的顺序一个接一个地播放。

```javascript
// 创建时间线动画
let tl = gsap.timeline()

// 现在用tl代替以前的gsap来设置动画即可。
tl.to(".green", { x: 600, duration: 2 });
tl.to(".purple", { x: 600, duration: 1 });
tl.to(".orange", { x: 600, duration: 1 });
```















![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659431136022-675259f2-1d40-4d5d-b46d-069904b5be13.gif)

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#_5-threejs场景种应用)5 Threejs场景种应用

设置立方体旋转

```javascript
gsap.to(
  cube.rotation, 
  { 
    x: 2 * Math.PI, 
    duration: 5, 
    ease: "power1.inOut" 
  }
);
```

















设置立方体来回往返运动

```javascript
// 设置动画
var animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "power1.inOut",
  //   设置重复的次数，无限次循环-1
  repeat: -1,
  //   往返运动
  yoyo: true,
  //   delay，延迟2秒运动
  delay: 2,
  // 当动画完成时，执行回调函数
  onComplete: () => {
    console.log("动画完成");
  },
  //当动画开始时，执行回调函数
  onStart: () => {
    console.log("动画开始");
  },
});
```









































让双击画面，控制立方体动画暂停和恢复动画，前面创建的animate1这个动画实例，有isActive方法，可以用来获取当前动画是暂停还是播放状态，播放状态时isActive方法返回为true，暂停时为false，根据这个状态来调用pause方法来暂停动画和恢复动画。

```javascript
window.addEventListener("dblclick", () => {
  //   console.log(animate1);
  if (animate1.isActive()) {
    //   暂停
    animate1.pause();
  } else {
    //   恢复
    animate1.resume();
  }
});
```





















## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/07-Gsap动画库基本使用.html#_6-综合上述代码)6 综合上述代码

1、在前面创建的项目中的main.js文件写入代码

```javascript
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";

// console.log(THREE);

// 目标：掌握gsap设置各种动画效果

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

// 设置动画
var animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "power1.inOut",
  //   设置重复的次数，无限次循环-1
  repeat: -1,
  //   往返运动
  yoyo: true,
  //   delay，延迟2秒运动
  delay: 2,
  onComplete: () => {
    console.log("动画完成");
  },
  onStart: () => {
    console.log("动画开始");
  },
});
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: "power1.inOut" });

window.addEventListener("dblclick", () => {
  //   console.log(animate1);
  if (animate1.isActive()) {
    //   暂停
    animate1.pause();
  } else {
    //   恢复
    animate1.resume();
  }
});

function render() {
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
```