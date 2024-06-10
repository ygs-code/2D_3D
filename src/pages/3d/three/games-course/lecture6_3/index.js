// import * as THREE from '../../libs/three137/three.module.js';
// import { RGBELoader } from '../../libs/three137/RGBELoader.js';
// import { LoadingBar } from '../../libs/LoadingBar.js';

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

    // 时间戳
    this.clock = new THREE.Clock();

    // 加载进度条
    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.assetsPath = "../../assets/";

    // 透视投影
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    // 设置相机位置
    this.camera.position.set(-11, 1.5, -1.5);

    let col = 0x201510;
    // 场景
    this.scene = new THREE.Scene();
    // 场景颜色
    this.scene.background = new THREE.Color(col);
    // 设置雾化效果，雾的颜色和背景颜色相近，这样远处网格线和背景颜色融为一体
    this.scene.fog = new THREE.Fog(col, 100, 200);
  /*
  半球光（HemisphereLight）
    光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    半球光不能投射阴影。
  */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    this.scene.add(ambient);

    // 平行光（DirectionalLight）
    // 平行光是沿着特定方向发射的光。这种光的表现像是无限远，从它发出的光线都是平行的。
    // 常常用平行光来模拟太阳光的效果。 太阳足够远，因此我们可以认为太阳的位置是无限远，
    // 所以我们认为从太阳发出的光线也都是平行的。
    const light = new THREE.DirectionalLight();
    light.position.set(4, 20, 20);
    light.target.position.set(-2, 0, 0);
    light.castShadow = true;

    //Set up shadow properties for the light
    // 设置光线的阴影属性
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 60;
    const d = 30;

    light.shadow.camera.left = -d;
    light.shadow.camera.bottom = -d * 0.25;
    light.shadow.camera.right = light.shadow.camera.top = d;
    this.scene.add(light);
    this.light = light;

    // 相机辅助线
    const helper = new THREE.CameraHelper(light.shadow.camera);
    this.scene.add(helper);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    // 鼠标控制器
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.load();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    // 更新投影
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setEnvironment() {
    // 模型加载器
    const loader = new RGBELoader(); //.setPath(this.assetsPath);
    // 模型解析器
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load(
      "/static/file/hdr/factory.hdr",
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

  // 加载模型
  load() {
    this.loadEnvironment();
  }

  loadEnvironment() {
    const loader = new GLTFLoader(); //.setPath(`${this.assetsPath}factory/`);

    this.loadingBar.visible = true;

    // Load a glTF resource
    // 加载模型
    loader.load(
      // resource URL
      "/static/file/factory/factory1.glb",
      // called when the resource is loaded
      (gltf) => {
        this.scene.add(gltf.scene);
        this.factory = gltf.scene;
        this.fans = [];

        const mergeObjects = { elements2: [], elements5: [], terrain: [] };

        gltf.scene.traverse((child) => {
            console.log('child==',child)
          if (child.isMesh) {
            if (child.name.includes("fan")) {

              // 获取风扇模型  
              this.fans.push(child);

            } else if (child.material.name.includes("elements2")) {

              mergeObjects.elements2.push(child);
              child.castShadow = true;

            } else if (child.material.name.includes("elements5")) {

              mergeObjects.elements5.push(child);
              child.castShadow = true;

            } else if (child.material.name.includes("terrain")) {

              mergeObjects.terrain.push(child);
              child.castShadow = true;

            } else if (child.material.name.includes("sand")) {

              child.receiveShadow = true;

            } else if (child.material.name.includes("elements1")) {

              child.castShadow = true;
              child.receiveShadow = true;

            } else if (child.parent.name.includes("main")) {

              child.castShadow = true;
            }
          }
        });

        for (let prop in mergeObjects) {
          const array = mergeObjects[prop];
          let material;

          array.forEach((object) => {

            if (material == undefined) {

              material = object.material;
            } else {

              object.material = material;
            }
          });
        }

        this.loadingBar.visible = false;

        this.renderer.setAnimationLoop(this.render.bind(this));
      },
      // called while loading is progressing
      (xhr) => {
        console.log("模型加载百分比：", (xhr.loaded / xhr.total) * 100 + "%");

        this.loadingBar.update("environment", xhr.loaded, xhr.total);
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  render() {
    const dt = this.clock.getDelta();

    if (this.fans !== undefined) {
      this.fans.forEach((fan) => {
        // 控制风扇转动
      /*
       orbit2.rotateZ(dt) 等同于 orbit2.rotation.z += dt
       rotation和rotateX(rotateY/rotateZ)的区别
       orbit2.rotateY(0.01); orbit2.rotation.y += 0.01;
      */
        fan.rotateY(dt);
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.game = game;
});
