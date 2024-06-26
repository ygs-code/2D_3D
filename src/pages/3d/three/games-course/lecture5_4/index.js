// import * as THREE from '../../libs/three137/three.module.js';
// import { RGBELoader } from '../../libs/three137/RGBELoader.js';
// import { LoadingBar } from '../../libs/LoadingBar.js';
import { Plane } from "./Plane.js";
import { Obstacles } from "./Obstacles.js";
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

    // 进度条
    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    // 时间戳
    this.clock = new THREE.Clock();

    this.assetsPath = "../../assets/";

    //透视投影
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.set(-4.37, 0, -4.75);
    // 设置眼镜的位置
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
    半球光不能投射阴影。
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

    this.active = false;
    this.load();

    // 事件
    window.addEventListener("resize", this.resize.bind(this));

    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));

    document.addEventListener("touchstart", this.mouseDown.bind(this));
    document.addEventListener("touchend", this.mouseUp.bind(this));
    document.addEventListener("mousedown", this.mouseDown.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));

    this.spaceKey = false;

    const btn = document.getElementById("playBtn");
    btn.addEventListener("click", this.startGame.bind(this));
  }

  startGame() {

    const gameover = document.getElementById("gameover");
    const instructions = document.getElementById("instructions");
    const btn = document.getElementById("playBtn");

    gameover.style.display = "none";
    instructions.style.display = "none";
    btn.style.display = "none";

    this.score = 0;
    this.lives = 3;

    let elm = document.getElementById("score");
    elm.innerHTML = this.score;

    elm = document.getElementById("lives");
    elm.innerHTML = this.lives;

    this.plane.reset();
    this.obstacles.reset();

    this.active = true;
  }

  resize() {
    // 更新投影矩阵
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  keyDown(evt) {
    switch (evt.keyCode) {
      case 32:
        this.spaceKey = true;
        break;
    }
  }

  keyUp(evt) {
    switch (evt.keyCode) {
      case 32:
        this.spaceKey = false;
        break;
    }
  }

  mouseDown(evt) {
    this.spaceKey = true;
  }

  mouseUp(evt) {
    this.spaceKey = false;
  }

  setEnvironment() {
    const loader = new RGBELoader(); // .setPath(this.assetsPath);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load(
      "/static/file/hdr/venice_sunset_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        self.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error(err.message);
      }
    );
  }

  load() {
    // 加载天空盒子
    this.loadSkybox();
    this.loading = true;
    this.loadingBar.visible = true;

    // 飞机类
    this.plane = new Plane(this);
    //
    this.obstacles = new Obstacles(this);
  }

  loadSkybox() {
    // 加载天空盒子
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath("/static/file/plane/paintedsky/")
      .load(
        ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
        () => {
          // 不断的回调渲染
          this.renderer.setAnimationLoop(this.render.bind(this));
        }
      );
  }

  gameOver() {
    this.active = false;

    const gameover = document.getElementById("gameover");
    const btn = document.getElementById("playBtn");

    gameover.style.display = "block";
    btn.style.display = "block";
  }

  // 碰到星星
  incScore() {
    this.score++;

    const elm = document.getElementById("score");

    elm.innerHTML = this.score;
  }

  // 碰到炮弹
  decLives() {
    this.lives--;

    const elm = document.getElementById("lives");

    elm.innerHTML = this.lives;

    if (this.lives == 0) {
      this.gameOver();
    }
  }

  // 更新相机
  updateCamera() {
    this.cameraController.position.copy(this.plane.position);
    this.cameraController.position.y = 0;
    this.cameraTarget.copy(this.plane.position);
    this.cameraTarget.z += 6;
    this.camera.lookAt(this.cameraTarget);
  }

  // 渲染
  render() {
    if (this.loading) {
      if (this.plane.ready && this.obstacles.ready) {
        this.loading = false;
        this.loadingBar.visible = false;
      } else {
        return;
      }
    }

    const time = this.clock.getElapsedTime();

    this.plane.update(time);

    if (this.active) {
      // 飞机模型位置
      this.obstacles.update(this.plane.position);
    }

    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }
}

// export { Game };

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.game = game;
});
