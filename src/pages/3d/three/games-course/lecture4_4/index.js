

import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LoadingBar } from '@/pages/3d/utils/LoadingBar.js';


import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

 
 

class Game {
    constructor() {
      // 创建一个div
      const container = document.createElement("div");
      // div 插入到body中
      document.body.appendChild(container);
  
      /*
      
      该对象用于跟踪时间。如果performance.now可用，
      则 Clock 对象通过该方法实现，否则回落到使用略欠精准的Date.now来实现。
      */
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
        50
      );
      this.camera.position.set(1, 1.7, 2.8);
  
      let col = 0x605550;
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(col);
  
      const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      this.scene.add(ambient);
  
      // 光
      const light = new THREE.DirectionalLight();
      light.position.set(0.2, 1, 1);
  
      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  
      this.renderer.outputEncoding = THREE.sRGBEncoding;
  
      container.appendChild(this.renderer.domElement);
      this.setEnvironment();
  
      // 控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 1, 0);
      controls.update();
  
      this.loadEve();
  
      window.addEventListener("resize", this.resize.bind(this));
    }
  
    resize() {
  
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 更新 透视投影
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    setEnvironment() {
  
      // 加载模型
      const loader = new RGBELoader()    // .setPath(this.assetsPath);


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
  
    loadEve() {
  
      const loader = new GLTFLoader()   //.setPath(`${this.assetsPath}factory/`);
  
      // 设置路径
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/static/js/draco/");
      loader.setDRACOLoader(dracoLoader);
      this.loadingBar.visible = true;
  
  
      // Load a glTF resource
      // 加载人物模型
      // 加载模型
      loader.load(
        // resource URL
        "/static/file/factory/eve.glb",
        // called when the resource is loaded
        (gltf) => {   


  
          this.scene.add(gltf.scene);
          this.eve = gltf.scene;
          this.mixer = new THREE.AnimationMixer(gltf.scene);
  
          this.animations = {};
  
          console.log('gltf.animations===',gltf.animations)
          // debugger
  
          gltf.animations.forEach((animation) => {
            this.animations[animation.name.toLowerCase()] = animation;
          });
  
          this.actionName = "";
          this.newAnim();
  
          this.loadingBar.visible = false;
  
          this.renderer.setAnimationLoop(this.render.bind(this));
        },
        // called while loading is progressing
        (xhr) => {
          this.loadingBar.progress = xhr.loaded / xhr.total;
        },
        // called when loading has errors
        (err) => {
          console.error(err);
        }
      );

    }
  
    newAnim() {
      const keys = Object.keys(this.animations);
      let index;
  
      console.log("keys========", keys);
      console.log("this.actionName========", this.actionName);
  
      do {
        index = Math.floor(Math.random() * keys.length);
        console.log("this.actionName========", this.actionName);
      } while (keys[index] == this.actionName);
  
      this.action = keys[index];

    //   this.action = keys[3];

  
      // this.action = keys[Math.floor(Math.random() * keys.length)];
  
      setTimeout(this.newAnim.bind(this), 5000);
    }
  
    set action(name) {
      if (this.actionName == name.toLowerCase()) return;
  
      const clip = this.animations[name.toLowerCase()];
  
      if (clip !== undefined) {
        const action = this.mixer.clipAction(clip);
        if (name == "shot") {
          action.clampWhenFinished = true;
          action.setLoop(THREE.LoopOnce);
        }
        action.reset();
  
        const nofade = this.actionName == "shot";
        this.actionName = name.toLowerCase();
  
        action.play();
        if (this.curAction) {
          if (nofade) {
            this.curAction.enabled = false;
          } else {
            this.curAction.crossFadeTo(action, 0.5);
          }
        }
        this.curAction = action;
      }
    }
  
    render() {
      const dt = this.clock.getDelta();
  
      if (this.mixer !== undefined) this.mixer.update(dt);
  
      this.renderer.render(this.scene, this.camera);
    }
  }


document.addEventListener("DOMContentLoaded", function () {
    const app = new Game();
    window.app = app;
});
