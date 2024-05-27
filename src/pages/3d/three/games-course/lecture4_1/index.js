

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, clock;
let model, animations;

const mixers = [], objects = [];

const params = {
  sharedSkeleton: false
};

init();
animate();

function init() {

  // 透视投影
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(2, 3, - 6);
  // 相机位置设置
  camera.lookAt(0, 1, 0);

  clock = new THREE.Clock();

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  /*
  
  半球光（HemisphereLight）
  光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
  */
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  /*
  
  平行光（DirectionalLight）
    平行光是沿着特定方向发射的光。这种光的表现像是无限远，
    从它发出的光线都是平行的。常常用平行光来模拟太阳光的效果。
    太阳足够远，因此我们可以认为太阳的位置是无限远，
    所以我们认为从太阳发出的光线也都是平行的。
  */
  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(- 3, 10, - 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 4;
  dirLight.shadow.camera.bottom = - 4;
  dirLight.shadow.camera.left = - 4;
  dirLight.shadow.camera.right = 4;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);

  // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  // ground
  // 网格（Mesh）
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // 加载模型
  const loader = new GLTFLoader();
  loader.load('/static/file/Soldier.glb', function (gltf) {

    model = gltf.scene;
    animations = gltf.animations;

    // 模型动画
    console.log('animations===', animations)

    // 
    model.traverse(function (object) {

      if (object.isMesh) {
        object.castShadow = true;
      }

    });

    setupDefaultScene();

  });

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  const gui = new GUI();

  // 控制器
  gui.add(params, 'sharedSkeleton').onChange(function () {

    clearScene();

    if (params.sharedSkeleton === true) {

      setupSharedSkeletonScene();
      debugger

    } else {

      setupDefaultScene();

    }

  });
  gui.open();

}

// 清除场景
function clearScene() {

  // 停止动画
  for (const mixer of mixers) {

    mixer.stopAllAction();

  }

  mixers.length = 0;

  //

  for (const object of objects) {

    scene.remove(object);

    scene.traverse(function (child) {

      if (child.isSkinnedMesh) {
        child.skeleton.dispose();
      }

    });

  }

}

function setupDefaultScene() {

  // three cloned models with independent skeletons.
  // each model can have its own animation state
  //三个具有独立骨架的克隆模型。
  //每个模型可以有自己的动画状态
  const model1 = SkeletonUtils.clone(model);
  const model2 = SkeletonUtils.clone(model);
  const model3 = SkeletonUtils.clone(model);

  model1.position.x = - 2;
  model2.position.x = 0;
  model3.position.x = 2;

  // 动画混合器是用于场景中特定对象的动画的播放器。
  // 当场景中的多个对象独立动画时，
  // 每个对象都可以使用同一个动画混合器。
  const mixer1 = new THREE.AnimationMixer(model1);
  const mixer2 = new THREE.AnimationMixer(model2);
  const mixer3 = new THREE.AnimationMixer(model3);

  // 执行动画状态
  // 第一个参数可以是动画剪辑(AnimationClip)对象或者动画剪辑的名称。
  mixer1.clipAction(animations[0]).play(); // idle
  mixer2.clipAction(animations[1]).play(); // run
  mixer3.clipAction(animations[3]).play(); // walk

  // 添加三个模型
  scene.add(
    model1,
    model2,
    model3
  );

  objects.push(
    model1,
    model2,
    model3
  );

  mixers.push(
    mixer1,
    mixer2,
    mixer3
  );

}

function setupSharedSkeletonScene() {

  // three cloned models with a single shared skeleton.
  // all models share the same animation state
  //一个共享骨架的三个克隆模型。
  //所有模型共享相同的动画状态
  // 骨架工具（SkeletonUtils）
  /*
   骨架工具（SkeletonUtils）
      克隆给定对象及其后代，确保任何 SkinnedMesh 实例都与其骨骼正确关联。
      同时，骨骼也会被克隆，且必须是传递给此方法的物体的后代。而其他数据，
      如几何形状和材料，是通过引用来实现重复使用的。
  */
  const sharedModel = SkeletonUtils.clone(model);
  const shareSkinnedMesh = sharedModel.getObjectByName('vanguard_Mesh');
  const sharedSkeleton = shareSkinnedMesh.skeleton;
  const sharedParentBone = sharedModel.getObjectByName('mixamorigHips');
  scene.add(sharedParentBone); // the bones need to be in the scene for the animation to work

  // 科隆三个模型
  const model1 = shareSkinnedMesh.clone();
  const model2 = shareSkinnedMesh.clone();
  const model3 = shareSkinnedMesh.clone();

  model1.bindMode = THREE.DetachedBindMode;
  model2.bindMode = THREE.DetachedBindMode;
  model3.bindMode = THREE.DetachedBindMode;

  // 矩阵
  const identity = new THREE.Matrix4();

  model1.bind(sharedSkeleton, identity);
  model2.bind(sharedSkeleton, identity);
  model3.bind(sharedSkeleton, identity);

  model1.position.x = - 2;
  model2.position.x = 0;
  model3.position.x = 2;

  // apply transformation from the glTF asset

  model1.scale.setScalar(0.01);
  model1.rotation.x = - Math.PI * 0.5;

  model2.scale.setScalar(0.01);
  model2.rotation.x = - Math.PI * 0.5;

  model3.scale.setScalar(0.01);
  model3.rotation.x = - Math.PI * 0.5;


  //  共有亲本骨 共享一个动画
  const mixer = new THREE.AnimationMixer(sharedParentBone);
  // 模型1 播放动画
  mixer.clipAction(animations[1]).play();

  //
  scene.add(
    sharedParentBone,   //  共有亲本骨 共享一个动画
    model1,  // 模型1
    model2,  // 模型2
    model3   // 模型3
  );

  objects.push(
    sharedParentBone,   //  共有亲本骨 共享一个动画
    model1,  // 模型1
    model2,   // 模型2
    model3   // 模型3
  );
  
  mixers.push(mixer);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  // console.log('delta===',delta)

  for (const mixer of mixers) {
    mixer.update(delta);
  }

  renderer.render(scene, camera);

}

