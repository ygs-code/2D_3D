import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
 
class App {
  constructor() {
    this.init();
  }

  resize() {
    // 设置投影宽高比
    this.camera.aspect = window.innerWidth / window.innerHeight;
    // 更新投影
    this.camera.updateProjectionMatrix();
    // 更新渲染
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.mesh1.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  }

  //随机生成十六进制颜色
  color16() {
    //十六进制颜色随机
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
  }
  init() {
    let container = document.body;
    //创建一个场景
    this.scene = new THREE.Scene();
    //透视摄像机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      700
    );
    //创建渲染器
    this.renderer = new THREE.WebGLRenderer();
    //渲染器尺寸
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // 创建三个球
    this.mesh1 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00
      })
    );
    this.mesh1.position.x = -3;
    this.scene.add(this.mesh1);

    this.mesh2 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff0000
      })
    );
    this.mesh2.position.x = 0;
    this.scene.add(this.mesh2);

    this.mesh3 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff
      })
    );
    this.mesh3.position.x = 3;
    this.scene.add(this.mesh3);


    //创建射线
    const raycaster = new THREE.Raycaster();
    //用一个二维向量保存鼠标点击画布上的位置
    const mouse = new THREE.Vector2(1, 1);


    window.addEventListener("click", (e) => {
      //设置鼠标向量的x,y值,将XY轴归一化，X从-1到1，Y为从-1到1，所以除以2
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      console.log(mouse.x, mouse.y);

      // 通过摄像机和鼠标的位置，更新涉嫌
      raycaster.setFromCamera(mouse, this.camera);


      //计算物体和射线的焦点能不能碰到物体
      const intersects = raycaster.intersectObjects([
        this.mesh1,
        this.mesh2,
        this.mesh3
      ]);

      console.log("intersects", intersects);

      if (intersects.length > 0) {
        intersects[0].object.material.color.set(this.color16());
      }

    });
    this.scene.background = new THREE.Color(0x999999);
    // 设置相机位置
    this.camera.position.z = 15;
    this.camera.position.y = 2;
    this.camera.position.x = 2;
    // 看的方向
    this.camera.lookAt(0, 0, 0);
    //添加世界坐标辅助器
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
    //添加轨道控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //添加阻尼带有惯性
    this.controls.enableDamping = true;
    //设置阻尼系数
    this.controls.dampingFactor = 0.05;

    //元素中插入canvas对象
    container.appendChild(this.renderer.domElement);
    this.animate();

    // if (WebGL.isWebGLAvailable()) {
    //   this.animate();
    // } else {
    //   const warning = WebGL.getWebGLErrorMessage();
    //   document.getElementById(document.body).appendChild(warning);
    // }
  }
  //旋转起来
  animate() {
    // console.log("  this====", this);
    // console.log("  this.controls====", this.controls);

    this.controls.update();
    requestAnimationFrame(() => {
      this.animate();
    });
    // this.mesh1.rotation.x += 0.01;
    // this.mesh1.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const app = new App();
  window.app = app;
});
 