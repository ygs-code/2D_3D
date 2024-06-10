// import * as THREE from '../../libs/three137/three.module.js';
// import { RGBELoader } from '../../libs/three137/RGBELoader.js';
// import { LoadingBar } from '../../libs/LoadingBar.js';
import { Plane } from "./Plane.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

class Game {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.clock = new THREE.Clock();

    // this.assetsPath = "../../assets/";

    // 透视投影
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.set(-4.37, 0, -4.75);
    this.camera.lookAt(0, 0, 6);

    // 相机控制器
    this.cameraController = new THREE.Object3D();
    this.cameraController.add(this.camera);
    this.cameraTarget = new THREE.Vector3(0, 0, 6);

    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.add(this.cameraController);

    /*

    半球光（HemisphereLight）
    光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    ambient.position.set(0.5, 1, 0.25);
    this.scene.add(ambient);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    this.load();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    // 
    this.camera.aspect = window.innerWidth / window.innerHeight;
    // 更新矩阵
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setEnvironment() {
    const loader = new RGBELoader(); //.setPath(this.assetsPath);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    loader.load(
      "/static/file/hdr/venice_sunset_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        this.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error(err.message);
      }
    );
  }

  load() {
    this.loading = true;
    this.loadingBar.visible = true;

    this.loadSkybox();
    this.plane = new Plane(this);
  }

  // 天空盒子
  loadSkybox() {
    // 加载模型

    this.scene.background = new THREE.CubeTextureLoader()
      // 天空盒子图片
      .setPath("/static/file/plane/paintedsky/")
      .load(
        ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
        () => {
          // 自动回调渲染函数
          this.renderer.setAnimationLoop(this.render.bind(this));
        }
      );
  }

  // 更新相机
  updateCamera() {
    this.cameraController.position.copy(this.plane.position);
    this.cameraController.position.y = 0;
    this.cameraTarget.copy(this.plane.position);
    this.cameraTarget.z += 6;
    // 相机
    this.camera.lookAt(this.cameraTarget);
  }

  render() {
    //
    if (this.loading) {
      if (this.plane.ready) {
        this.loading = false;
        this.loadingBar.visible = false;
      } else {
        return;
      }
    }

    // 获取当前时间戳
    const time = this.clock.getElapsedTime();

    // 更新飞机渲染
    this.plane.update(time);
    this.updateCamera();
    // 重新渲染
    this.renderer.render(this.scene, this.camera);
  }
}

// export { Game };

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.game = game;
});
