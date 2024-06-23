
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

class Game {
  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    this.clock = new THREE.Clock();

    // 模型进度条加载
    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.assetsPath = '../../assets/';

    // 相机投影
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    // 设置相机位置
    this.camera.position.set(1, 1.7, 2.8);

    let col = 0x605550;
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(col);

    // 半球光（HemisphereLight）
    // 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    // 半球光不能投射阴影。
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    this.scene.add(ambient);


    // 平行光（DirectionalLight）
    // 平行光是沿着特定方向发射的光。这种光的表现像是无限远，从它发出的光线都是平行的。
    // 常常用平行光来模拟太阳光的效果。 太阳足够远，因此我们可以认为太阳的位置是无限远，
    // 所以我们认为从太阳发出的光线也都是平行的。
    const light = new THREE.DirectionalLight();
    // 设置光的位置
    light.position.set(0.2, 1, 1);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    // 相机控制器
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    this.loadNPC();

    window.addEventListener('resize', this.resize.bind(this));

  }

  resize() {
    // 更新相机
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setEnvironment() {
    const loader = new RGBELoader()  //.setPath(this.assetsPath);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load('/static/file/hdr/factory.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();

      self.scene.environment = envMap;

    }, undefined, (err) => {
      console.error(err.message);
    });
  }

  loadNPC() {
    // 模型加载器
    const loader = new GLTFLoader() //.setPath(`${this.assetsPath}factory/`);
    // 模型加载器
    const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('../../libs/three137/draco/');
    dracoLoader.setDecoderPath("/static/js/draco/");
    loader.setDRACOLoader(dracoLoader);
    this.loadingBar.visible = true;

    // Load a glTF resource
    loader.load(
      // resource URL
      '/static/file/factory/swat-guy.glb',
      // called when the resource is loaded
      gltf => {

        // 获取到模型加载到场景中
          // 模型加载完成后，从gltf.scene或gltf.animations中选择需要的部分
        // 或者 gltf.scene.children[index] 来选择特定的子对象

        console.log('gltf===',gltf)
        console.log('gltf.scene===',gltf.scene)
        this.scene.add(gltf.scene);
        this.eve = gltf.scene;
        // 创建动画
        // 动画混合器是用于场景中特定对象的动画的播放器。
        // 当场景中的多个对象独立动画时，
        // 每个对象都可以使用同一个动画混合器。
        
    /*
    
      动画混合器是用于场景中特定对象的动画的播放器。
      当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。

    */
        this.mixer = new THREE.AnimationMixer(gltf.scene);

        this.animations = {};

        
        gltf.animations.forEach(animation => {
          // 把所有动画保存到一个对象中
          this.animations[animation.name.toLowerCase()] = animation;
        });

        this.actionName = '';
        this.newAnim();

        this.loadingBar.visible = false;

        this.renderer.setAnimationLoop(this.render.bind(this));
      },
      // called while loading is progressing
      xhr => {

        this.loadingBar.progress = (xhr.loaded / xhr.total);

      },
      // called when loading has errors
      err => {

        console.error(err);

      }
    );
  }

  newAnim() {
    // 获取动画keys
    const keys = Object.keys(this.animations);
    let index;

    do {
      // 随机数，获取不同动画名称
      index = Math.floor(Math.random() * keys.length);
      // 如果同一个动画播放两次，则重新生产新的随机数
    } while (keys[index] == this.actionName);

    this.action = keys[index];

    // 3秒钟后切换动画
    setTimeout(this.newAnim.bind(this), 3000);
  }

  // 设置动画名称
  set action(name) {
    if (this.actionName == name.toLowerCase()) return;

    const clip = this.animations[name.toLowerCase()];

    if (clip !== undefined) {
      
    //剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
      const action = this.mixer.clipAction(clip);

      
      action.timeScale = 1;//默认1，可以调节播放速度.timeScale = 20;//默认1，可以调节播放速度
      if (name == 'shot') {
        action.clampWhenFinished = true;
        // 循环模式 (可以通过setLoop改变)。默认值是 THREE.LoopRepeat (重复repetitions次数无穷)
        // THREE.LoopOnce - 只执行一次
        action.setLoop(THREE.LoopOnce);
      }
      action.reset();
      const nofade = this.actionName == 'shot';
      this.actionName = name.toLowerCase();
      action.play();
      if (this.curAction) {
        if (nofade) {
          // 重置动作。此方法可链式调用。
          /*
            该方法会将暂停值 paused 设为false, 
            启用值enabled 设为true,
            时间值 time设为0, 中断任何预定的淡入淡出和变形,
            以及移除内部循环次数以及延迟启动。
          */
          this.curAction.enabled = false;
        } else {
          // 说明: 与 fadeIn/fadeOut一样, 淡入淡出动作开始/结束时的权重是1.
          this.curAction.crossFadeTo(action, 0.5);
        }
      }
      this.curAction = action;
    }
  }

  render() {
    const dt = this.clock.getDelta();

     //clock.getDelta()方法获得两帧的时间间隔
      //更新混合器相关时间
    if (this.mixer !== undefined){
      /*
      播放关键帧动画的时候，
      注意在渲染函数render()
      中执行mixer.update(渲染间隔时间)告诉帧动画
      系统Threejs两次渲染的时间间隔，获得时间间隔
      可以通过Threejs提供的一个时钟类Clock实现。
      */
      this.mixer.update(dt);
    } 

    this.renderer.render(this.scene, this.camera);

  }
}


// export { Game };

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.game = game;
});
