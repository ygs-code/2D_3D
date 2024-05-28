import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, renderer, camera, stats;
let model, skeleton, mixer, clock;

const crossFadeControls = [];

let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;
let actions, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;
// 文档 http://cw.hubwiz.com/card/c/three.js-api/1/1/1/

function init() {
  const container = document.body;
  // 透视投影
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(1, 2, -3);
  camera.lookAt(0, 1, 0);

  clock = new THREE.Clock();
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  /*
  半球光（HemisphereLight）
    光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    半球光不能投射阴影。
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
  dirLight.position.set(-3, 10, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);

  // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

  // ground
  // 网格
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // 加载模型
  const loader = new GLTFLoader();
  loader.load("/static/file/Soldier.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);

    model.traverse(function (object) {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });

    /*
    SkeletonHelper
      用来模拟骨骼 Skeleton 的辅助对象. 该辅助对象使用 LineBasicMaterial 材质.
    */
    skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    scene.add(skeleton);

    //
   // 创建控制面板
    createPanel();

    //

    const animations = gltf.animations;

    /*
    
      动画混合器是用于场景中特定对象的动画的播放器。
      当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。

    */
    mixer = new THREE.AnimationMixer(model);

    /*

      .clipAction (clip : AnimationClip, optionalRoot : Object3D) : AnimationAction
      返回所传入的剪辑参数的AnimationAction, 根对象参数可选，默认值为混合器的默认根对象。
      第一个参数可以是动画剪辑(AnimationClip)对象或者动画剪辑的名称。

      */
    idleAction = mixer.clipAction(animations[0]);
    walkAction = mixer.clipAction(animations[3]);
    runAction = mixer.clipAction(animations[1]);

    actions = [idleAction, walkAction, runAction];
    // 激活所有动作
    activateAllActions();

    animate();
  });

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);
}

// 创建控制面板
function createPanel() {
  const panel = new GUI({ width: 310 });

  const folder1 = panel.addFolder("Visibility");
  const folder2 = panel.addFolder("Activation/Deactivation");
  const folder3 = panel.addFolder("Pausing/Stepping");
  const folder4 = panel.addFolder("Crossfading");
  const folder5 = panel.addFolder("Blend Weights");
  const folder6 = panel.addFolder("General Speed");

  settings = {
    "show model": true,
    "show skeleton": false,
    // 停用所有动作
    "deactivate all": deactivateAllActions,
    // 激活所有动作
    "activate all": activateAllActions,
    // 暂停继续
    "pause/continue": pauseContinue,
    // 转单步模式
    "make single step": toSingleStepMode,
    "modify step size": 0.05,

    "from walk to idle": function () {
      prepareCrossFade(walkAction, idleAction, 1.0);
    },
    "from idle to walk": function () {
      prepareCrossFade(idleAction, walkAction, 0.5);
    },
    "from walk to run": function () {
      prepareCrossFade(walkAction, runAction, 2.5);
    },
    "from run to walk": function () {
      prepareCrossFade(runAction, walkAction, 5.0);
    },
    "use default duration": true,
    "set custom duration": 3.5,
    "modify idle weight": 0.0,
    "modify walk weight": 1.0,
    "modify run weight": 0.0,
    "modify time scale": 1.0
  };

  folder1.add(settings, "show model").onChange(showModel);
  folder1.add(settings, "show skeleton").onChange(showSkeleton);
  folder2.add(settings, "deactivate all");
  folder2.add(settings, "activate all");
  folder3.add(settings, "pause/continue");
  folder3.add(settings, "make single step");
  folder3.add(settings, "modify step size", 0.01, 0.1, 0.001);
  crossFadeControls.push(folder4.add(settings, "from walk to idle"));
  crossFadeControls.push(folder4.add(settings, "from idle to walk"));
  crossFadeControls.push(folder4.add(settings, "from walk to run"));
  crossFadeControls.push(folder4.add(settings, "from run to walk"));
  folder4.add(settings, "use default duration");
  folder4.add(settings, "set custom duration", 0, 10, 0.01);
  folder5
    .add(settings, "modify idle weight", 0.0, 1.0, 0.01)
    .listen()
    .onChange(function (weight) {
      setWeight(idleAction, weight);
    });
  folder5
    .add(settings, "modify walk weight", 0.0, 1.0, 0.01)
    .listen()
    .onChange(function (weight) {
      setWeight(walkAction, weight);
    });
  folder5
    .add(settings, "modify run weight", 0.0, 1.0, 0.01)
    .listen()
    .onChange(function (weight) {
      setWeight(runAction, weight);
    });
  folder6
    .add(settings, "modify time scale", 0.0, 1.5, 0.01)
    .onChange(modifyTimeScale);

  folder1.open();
  folder2.open();
  folder3.open();
  folder4.open();
  folder5.open();
  folder6.open();
}

function showModel(visibility) {
  model.visible = visibility;
}

function showSkeleton(visibility) {
  skeleton.visible = visibility;
}

function modifyTimeScale(speed) {
  mixer.timeScale = speed;
}

// 停用所有动作
function deactivateAllActions() {
  actions.forEach(function (action) {
    action.stop();
  });
}

// 激活所有动作
function activateAllActions() {
  setWeight(idleAction, settings["modify idle weight"]);
  setWeight(walkAction, settings["modify walk weight"]);
  setWeight(runAction, settings["modify run weight"]);
  actions.forEach(function (action) {
    action.play();
  });
}

// 暂停继续
function pauseContinue() {
  if (singleStepMode) {
    singleStepMode = false;
    // 不暂停所有动作
    unPauseAllActions();
  } else {
    if (idleAction.paused) {
      // 不暂停所有动作
      unPauseAllActions();
    } else {
      // 暂停所有动作
      pauseAllActions();
    }
  }
}

// 暂停所有动作
function pauseAllActions() {
  actions.forEach(function (action) {
    // paused置为true会通过将动作的有效时间比例改为0来使动作暂停执行。默认值是false
    action.paused = true;
  });
}

// 不暂停所有动作
function unPauseAllActions() {
  actions.forEach(function (action) {
    // paused置为true会通过将动作的有效时间比例改为0来使动作暂停执行。默认值是false
    action.paused = false;
  });
}
// 转单步模式
function toSingleStepMode() {
  // 不暂停所有动作
  unPauseAllActions();

  singleStepMode = true;
  sizeOfNextStep = settings["modify step size"];
}

//切换默认/自定义交叉渐变持续时间(根据用户选择)
function prepareCrossFade(startAction, endAction, defaultDuration) {
  // Switch default / custom crossfade duration (according to the user's choice)

  // 切换默认交叉渐变持续时间<->自定义交叉渐变持续时间
  const duration = setCrossFadeDuration(defaultDuration);

  // 确保我们没有在singleStepMode中继续，并且所有的动作都是未暂停的
  // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

  singleStepMode = false;

  // 不暂停所有动作
  unPauseAllActions();

  //如果当前动作为'idle'(持续时间为4秒)，立即执行crossfade;
  //否则等待当前动作完成当前循环
  // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
  // else wait until the current action has finished its current loop

  if (startAction === idleAction) {
    executeCrossFade(startAction, endAction, duration);
  } else {
    synchronizeCrossFade(startAction, endAction, duration);
  }
}

// 切换默认交叉渐变持续时间<->自定义交叉渐变持续时间
function setCrossFadeDuration(defaultDuration) {
  // Switch default crossfade duration <-> custom crossfade duration

  if (settings["use default duration"]) {
    return defaultDuration;
  } else {
    return settings["set custom duration"];
  }
}

function synchronizeCrossFade(startAction, endAction, duration) {
  mixer.addEventListener("loop", onLoopFinished);

  function onLoopFinished(event) {
    if (event.action === startAction) {
      mixer.removeEventListener("loop", onLoopFinished);

      executeCrossFade(startAction, endAction, duration);
    }
  }
}

function executeCrossFade(startAction, endAction, duration) {
  //不仅开始动作，结束动作的权重也必须为1
  //(关于启动动作，这个地方已经保证了)
  // Not only the start action, but also the end action must get a weight of 1 before fading
  // (concerning the start action this is already guaranteed in this place)

  setWeight(endAction, 1);
  endAction.time = 0;

  // Crossfade with warping - you can also try without warping by setting the third parameter to false
  // 带扭曲的交叉渐变-你也可以通过将第三个参数设置为false来尝试不扭曲

  /*
    # .crossFadeTo ( fadeInAction : AnimationAction, durationInSeconds : Number, warpBoolean : Boolean ) : AnimationAction
      在传入的时间段内, 让此动作淡出（fade out），同时让另一个动作淡入。此方法可链式调用。
      如果warpBoolean值是true, 额外的 warping (时间比例的渐变)将会被应用。
      说明: 与 fadeIn/fadeOut一样, 淡入淡出动作开始/结束时的权重是1.
  */

  startAction.crossFadeTo(endAction, duration, true);
}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))

//这个函数是必需的，因为animationAction.crossFadeTo()会禁用它的开始动作和设置
//开始动作的时间刻度到((开始动画的持续时间)/(结束动画的持续时间))

function setWeight(action, weight) {
  /*
   enabled 值设为false会禁用动作, 也就是无效.默认值是true
      当enabled被重新置为true, 动画将从当前时间（time）继续 (将 enabled 置为 false 不会重置此次动作)
      说明: 将enabled置为true不会让动画自动重新开始。只有满足以下条件时才会马上重新开始: 暂停（paused）值为false, 
      同时动作没有失效 (执行停止(stop)命令或重置(reset)命令， 且权重(weight)和时间比例(timeScale)都不能为0
  
  */
  action.enabled = true;

  /*
  设置时间比例（timeScale）以及停用所有的变形)。 此方法可以链式调用。
    如果暂停 （paused）值为false, 有效的时间比例(一个内部属性) 也会被设为该值; 否则有效时间比例 (直接影响当前动画 将会被设为0.
    说明: 如果时间比例.timeScale 被此方法设为0，暂停值paused不会被自动改为true。
  
  */
  action.setEffectiveTimeScale(1);

  /*
  
  .setEffectiveWeight ( weight : Number ) : AnimationAction
    设置权重（weight）以及停止所有淡入淡出。该方法可以链式调用。
    如果启用属性（enabled）为true, 那么有效权重(一个内部属性) 也会被设为该值; 否则有效权重 (直接影响当前动画)将会被设为0.
    说明: 如果该方法将权重weight值设为0，启用值enabled不会被自动改为false。
  */
  action.setEffectiveWeight(weight);
}

// Called by the render loop
// 由渲染循环调用
function updateWeightSliders() {
  settings["modify idle weight"] = idleWeight;
  settings["modify walk weight"] = walkWeight;
  settings["modify run weight"] = runWeight;
}

// Called by the render loop
// 由渲染循环调用
function updateCrossFadeControls() {
  if (idleWeight === 1 && walkWeight === 0 && runWeight === 0) {
    crossFadeControls[0].disable();
    crossFadeControls[1].enable();
    crossFadeControls[2].disable();
    crossFadeControls[3].disable();
  }

  if (idleWeight === 0 && walkWeight === 1 && runWeight === 0) {
    crossFadeControls[0].enable();
    crossFadeControls[1].disable();
    crossFadeControls[2].enable();
    crossFadeControls[3].disable();
  }

  if (idleWeight === 0 && walkWeight === 0 && runWeight === 1) {
    crossFadeControls[0].disable();
    crossFadeControls[1].disable();
    crossFadeControls[2].disable();
    crossFadeControls[3].enable();
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // Render loop

  requestAnimationFrame(animate);

  /*
     # .getEffectiveWeight () : number
         返回影响权重(考虑当前淡入淡出状态和enabled的值).
   */
  idleWeight = idleAction.getEffectiveWeight();
  walkWeight = walkAction.getEffectiveWeight();
  runWeight = runAction.getEffectiveWeight();

  // Update the panel values if weights are modified from "outside" (by crossfadings)
  //如果权重从“外部”修改(通过交叉渐变)，则更新面板值
  updateWeightSliders();

  // Enable/disable crossfade controls according to current weight values
//根据当前权重值启用/禁用交叉渐变控件
  updateCrossFadeControls();

  // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
  // 获取自上一帧以来经过的时间，用于混音器更新(如果不是单步模式)
  let mixerUpdateDelta = clock.getDelta();

  // If in single step mode, make one step and then do nothing (until the user clicks again)
  //如果是单步模式，做一步然后什么都不做(直到用户再次点击)
  if (singleStepMode) {
    mixerUpdateDelta = sizeOfNextStep;
    sizeOfNextStep = 0;
  }

  // Update the animation mixer, the stats panel, and render this frame
  //更新动画混合器，统计面板，并渲染这一帧
  mixer.update(mixerUpdateDelta);

  stats.update();

  renderer.render(scene, camera);
}

window.onload = () => {
  init();
};
