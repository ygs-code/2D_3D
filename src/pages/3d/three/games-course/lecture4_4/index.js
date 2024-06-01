import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// 模型动画文档 http://cw.hubwiz.com/card/c/three.js-api/1/1/1/
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
    // 设置相机位置
    this.camera.position.set(1, 1.7, 2.8);

    let col = 0x605550;
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(col);

    /*
        半球光（HemisphereLight）
            光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
            半球光不能投射阴影。
     */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    this.scene.add(ambient);

    /*
        平行光（DirectionalLight）
            平行光是沿着特定方向发射的光。这种光的表现像是无限远，
            从它发出的光线都是平行的。常常用平行光来模拟太阳光的效果。
            太阳足够远，因此我们可以认为太阳的位置是无限远，
            所以我们认为从太阳发出的光线也都是平行的。
     */
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
    const loader = new RGBELoader(); // .setPath(this.assetsPath);

    // 解析器
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
    // GLTFL加载器
    const loader = new GLTFLoader(); //.setPath(`${this.assetsPath}factory/`);

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

        // 动画集合
        console.log("gltf.animations===", gltf.animations);
        // debugger

        gltf.animations.forEach((animation) => {
          this.animations[animation.name.toLowerCase()] = animation;
        });

        this.actionName = "";
        this.newAnim();

        this.loadingBar.visible = false;

        // 回调函数
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
    // 模型动画转换成数组
    const keys = Object.keys(this.animations);
    let index;

    console.log("keys========", keys);
    console.log("this.actionName========", this.actionName);

    // 这里算法是如果当前生产动画和上一次动画相同则重新生成一个动画名称
    do {
      index = Math.floor(Math.random() * keys.length);
      console.log("this.actionName========", this.actionName);
    } while (keys[index] == this.actionName);

    this.action(keys[index]);

    //   this.action = keys[3];
    // this.action = keys[Math.floor(Math.random() * keys.length)];

    setTimeout(this.newAnim.bind(this), 3000);
  }

  // 这个set 函数 相当于 设置值的时候就会回调这个函数 这个跟 函数描述一样，但是一般很少这样用
  // set   action(name) {
  action(name) {
    if (this.actionName == name.toLowerCase()) {
      return;
    }

    const clip = this.animations[name.toLowerCase()];

    if (clip !== undefined) {
      // 切换动画效果
      const action = this.mixer.clipAction(clip);

      //
      if (name == "shot") {
        /*
        如果 clampWhenFinished 值设为true, 那么动画将在最后一帧之后自动暂停（paused）
            如果 clampWhenFinished 值为false, enabled 属性值将在动作的最后一次循环完成之后自动改为false, 那么这个动作以后就不会再执行。
            默认值为false
            说明: 动作如果被中断了，clampWhenFinished将无效 (只有当最后一次循环执行完毕之后才能起效）
        */

        action.clampWhenFinished = true;
        /*
        # .setLoop ( loopMode : Number, repetitions : Number ) : AnimationAction
            设置循环（loop mode）及循环重复次数（repetitions）。改方法可被链式调用。
        */
        // THREE.LoopOnce - 只执行一次
        action.setLoop(THREE.LoopOnce);
      }

      /*
        重置动作。此方法可链式调用。
            该方法会将暂停值 paused 设为false, 启用值enabled 设为true,时间值 time设为0, 
            中断任何预定的淡入淡出和变形, 以及移除内部循环次数以及延迟启动。
            说明: 停止方法stop内调用了重置方法（reset）, 但是 .reset不会调用 .stop。 
            这就表示: 如果你想要这两者, 重置并且停止, 不要调用reset; 而应该调用stop。
      */
      action.reset();

      const nofade = this.actionName == "shot";
      this.actionName = name.toLowerCase();

      // 播放动画
      action.play();
      if (this.curAction) {
        if (nofade) {
          // 暂停
          this.curAction.enabled = false;
        } else {
          /*
            # .crossFadeTo ( fadeInAction : AnimationAction, durationInSeconds : Number, warpBoolean : Boolean ) : AnimationAction
                    在传入的时间段内, 让此动作淡出（fade out），同时让另一个动作淡入。此方法可链式调用。
                    如果warpBoolean值是true, 额外的 warping (时间比例的渐变)将会被应用。
                    说明: 与 fadeIn/fadeOut一样, 淡入淡出动作开始/结束时的权重是1.
            */
          this.curAction.crossFadeTo(action, 0.5);
        }
      }
      this.curAction = action;
    }
  }

  render() {
    const dt = this.clock.getDelta();

    if (this.mixer !== undefined) {
      this.mixer.update(dt);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const app = new Game();
  window.app = app;
});
