import * as THREE from "three";
import * as dat from "dat.gui";

// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";

// console.log(THREE);

// 目标：js控制画面全屏

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
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
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
// 场景也可以改变属性的
scene.add(cube);

const gui = new dat.GUI();
// //控制器一个选项
// gui.add(
//     cube.position, // 需要修改的对象
//     'x' // 需要修改的属性
// )
//     .min(0)
//     .max(5)
//     // 每次改变为0.1
//     .step(0.01)
//     .name('改变x轴')
//     .onChange((value) => {
//         // 回调函数
//         console.log('value==', value);
//     })
//     .onFinishChange((value) => {
//         // 完全修改停下来的时候触发这个事件
//         console.log('onFinishChange value==', value);
//     });

// // 控制场景属性
// gui.add(scene.position, 'x')
//     .min(0)
//     .max(5) // 每次改变为0.1
//     .step(0.01)
//     .name('改变场景x轴');

// 改变颜色
let parmas = {
  color: "rgb(0,0,0,0)",
  fn: () => {
    gsap.to(cube.position, {x: 5, duration: 2, yoyo: true, repeat: -1});
  },
};
// 改变颜色
// gui.addColor(parmas, 'color')
//     .onChange((color) => {
//         console.log('color==', color);
//         // 设置材质颜色
//         //  cubeMaterial.color.set(color);
//         // 材质
//         cube.material.color.set(color);
//     })
//     .name('颜色');

// // 设置选项方法
// gui.add(cube, 'visible').name('是否显示');

// // 设置按钮 触发点击某个事件
// gui.add(parmas, 'fn').name("立方运动");

// 设置一个文件夹
const folder = gui.addFolder("设置立方体");

// 改变颜色
folder
  .addColor(parmas, "color")
  .onChange((color) => {
    console.log("color==", color);
    // 设置材质颜色
    //  cubeMaterial.color.set(color);
    // 材质
    cube.material.color.set(color);
  })
  .name("颜色");

//控制器一个选项
folder
  .add(
    cube.position, // 需要修改的对象
    "x" // 需要修改的属性
  )
  .min(0)
  .max(5)
  // 每次改变为0.1
  .step(0.01)
  .name("改变x轴")
  .onChange((value) => {
    // 回调函数
    console.log("value==", value);
  })
  .onFinishChange((value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  });

// 控制场景属性
folder
  .add(scene.position, "x")
  .min(0)
  .max(5) // 每次改变为0.1
  .step(0.01)
  .name("改变场景x轴");

// 材质一个选项
folder.add(cube.material, "wireframe");
// 设置按钮 触发点击某个事件
folder.add(parmas, "fn").name("立方运动");
// 设置选项方法
folder.add(cube, "visible").name("是否显示");

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
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

console.log(cubeGeometry);
console.log(cube);

window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //   双击控制屏幕进入全屏，退出全屏
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    //   退出全屏，使用document对象
    document.exitFullscreen();
  }
  //   console.log(fullScreenElement);
});

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  // resizeRendererToDisplaySize(renderer);
});

// function resizeRendererToDisplaySize(renderer) {
//   const canvas = renderer.domElement;
//   const pixelRatio = window.devicePixelRatio;
//   const width = canvas.clientWidth * pixelRatio | 0;
//   const height = canvas.clientHeight * pixelRatio | 0;
//   const needResize = canvas.width !== width || canvas.height !== height;
//   console.log('needResize===',needResize);
//   // if (needResize) {
//     renderer.setSize(width, height, false);
//   // }
//   return needResize;
// }
