import THREE from "./Three";

import KeyboardState from "@/pages/3d/utils/KeyboardState.js";
import Detector from "@/pages/3d/utils/Detector.js";
import WindowResize from "@/pages/3d/utils/WindowResize.js";
import FullScreen from "@/pages/3d/utils/FullScreen.js";
//引入性能监视器stats.js,显示帧率
import Stats from "three/addons/libs/stats.module.js";

import xpos from "static/image/xpos.png";
import xneg from "static/image/xneg.png";
import ypos from "static/image/ypos.png";
import yneg from "static/image/yneg.png";
import zpos from "static/image/zpos.png";
import zneg from "static/image/zneg.png";

import dawnmountainXpos from "static/image/dawnmountain-xpos.png";
import dawnmountainXneg from "static/image/dawnmountain-xneg.png";
import dawnmountainYpos from "static/image/dawnmountain-ypos.png";
import dawnmountainYneg from "static/image/dawnmountain-yneg.png";
import dawnmountainZpos from "static/image/dawnmountain-zpos.png";
import dawnmountainZneg from "static/image/dawnmountain-zneg.png";

import checkerboard from "static/image/checkerboard.jpg";

window.onload = () => {
  var container, scene, renderer, controls, stats;
  var keyboard = new KeyboardState();
  var clock = new THREE.Clock();

  // custom global variables
  var MovingCube;
  var textureCamera, mainCamera;

  // intermediate scene for reflecting the reflection
  var screenScene, screenCamera, firstRenderTarget, finalRenderTarget;

  init();
  animate();

  // FUNCTIONS
  function init() {
    // SCENE
    // 创建场景
    scene = new THREE.Scene();

    // CAMERAS
    // 获取宽
    var SCREEN_WIDTH = window.innerWidth,
      // 获取高
      SCREEN_HEIGHT = window.innerHeight;
    // 角度
    var VIEW_ANGLE = 45,
      // 宽高比
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      // 近截面
      NEAR = 0.1,
      // 远截面
      FAR = 20000;

    // camera 1
    // 透视投影 相机1
    mainCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(mainCamera);
    mainCamera.position.set(0, 200, 500);
    mainCamera.lookAt(scene.position);

    // camera 2  相机2
    textureCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(textureCamera);

    // RENDERER
    if (Detector.webgl) {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } else {
      renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    container = document.body;

    // 添加渲染
    container.appendChild(renderer.domElement);

    // EVENTS
    WindowResize(renderer, mainCamera);
    FullScreen.bindKey({ charCode: "m".charCodeAt(0) });

    // STATS 性能监听
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    // LIGHT 添加光
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);

    // FLOOR  添加纹理
    var floorTexture = new THREE.ImageUtils.loadTexture(checkerboard);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    var floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      side: THREE.DoubleSide
    });

    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    // SKYBOX/FOG
    var materialArray = [];

    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(dawnmountainXpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(dawnmountainXneg)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(dawnmountainYpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(dawnmountainYneg)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(dawnmountainZpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(dawnmountainZneg)
      })
    );

    for (var i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

    var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);

    var skyboxGeom = new THREE.CubeGeometry(5000, 5000, 5000, 1, 1, 1);

    var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
    scene.add(skybox);

    ////////////
    // CUSTOM //
    ////////////

    // create an array with six textures for a cool cube
    var materialArray = [];
    // 立方体
    materialArray.push(
      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(xpos) })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(xneg) })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(ypos) })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(yneg) })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(zpos) })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(zneg) })
    );
    var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
    var MovingCubeGeom = new THREE.CubeGeometry(
      50,
      50,
      50,
      1,
      1,
      1,
      materialArray
    );
    MovingCube = new THREE.Mesh(MovingCubeGeom, MovingCubeMat);
    MovingCube.position.set(0, 25.1, 0);
    scene.add(MovingCube);

    // a little bit of scenery...
    // 添加光
    var ambientlight = new THREE.AmbientLight(0x111111);
    scene.add(ambientlight);

    var wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true
    });

    // torus knot
    var colorMaterial1 = new THREE.MeshPhongMaterial({ color: 0xff3333 });
    var shape1 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 2, 5),
      [colorMaterial1, wireMaterial]
    );
    shape1.position.set(-200, 50, -200);
    scene.add(shape1);

    // torus knot
    var colorMaterial2 = new THREE.MeshPhongMaterial({ color: 0x33ff33 });
    var shape2 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 2),
      [colorMaterial2, wireMaterial]
    );
    shape2.position.set(200, 50, -200);
    scene.add(shape2);

    // torus knot
    var colorMaterial3 = new THREE.MeshPhongMaterial({ color: 0xffff33 });
    var shape3 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 4, 3),
      [colorMaterial3, wireMaterial]
    );
    shape3.position.set(200, 50, 200);
    scene.add(shape3);

    // torus knot
    var colorMaterial4 = new THREE.MeshPhongMaterial({ color: 0x3333ff });
    var shape4 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 4),
      [colorMaterial4, wireMaterial]
    );
    shape4.position.set(-200, 50, 200);
    scene.add(shape4);

    // intermediate scene.
    //   this solves the problem of the mirrored texture by mirroring it again.
    //   consists of a camera looking at a plane with the mirrored texture on it.
    screenScene = new THREE.Scene();

 
    // 场景相机
    screenCamera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,

      window.innerHeight / 2,
      window.innerHeight / -2,
      -10000,
      10000
    );
    screenCamera.position.z = 1;
    screenScene.add(screenCamera);

    var screenGeometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight
    );

    
    firstRenderTarget = new THREE.WebGLRenderTarget(512, 512, {
      format: THREE.RGBFormat
    });
    var screenMaterial = new THREE.MeshBasicMaterial({
      map: firstRenderTarget
    });



    var quad = new THREE.Mesh(screenGeometry, screenMaterial);
    // quad.rotation.x = Math.PI / 2;
    screenScene.add(quad);

    // final version of camera texture, used in scene. //最终版本的相机纹理，在场景中使用。
    var planeGeometry = new THREE.CubeGeometry(400, 200, 1, 1);

    finalRenderTarget = new THREE.WebGLRenderTarget(512, 512, {
      format: THREE.RGBFormat
    });

    var planeMaterial = new THREE.MeshBasicMaterial({ map: finalRenderTarget });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 100, -500);
    scene.add(plane);

    // pseudo-border for plane, to make it easier to see
    //伪边界的平面，使其更容易看到
    var planeGeometry1 = new THREE.CubeGeometry(420, 220, 1, 1);
    var planeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
    plane1.position.set(0, 100, -502);
    scene.add(plane1);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
    update();
  }

  function update() {
    var delta = clock.getDelta(); // seconds.
    var moveDistance = 200 * delta; // 200 pixels per second
    var rotateAngle = (Math.PI / 2) * delta; // pi/2 radians (90 degrees) per second

    // local transformations

    // move forwards/backwards/left/right
    if (keyboard.pressed("W")) MovingCube.translateZ(-moveDistance);
    if (keyboard.pressed("S")) MovingCube.translateZ(moveDistance);
    if (keyboard.pressed("Q")) MovingCube.translateX(-moveDistance);
    if (keyboard.pressed("E")) MovingCube.translateX(moveDistance);

    // rotate left/right/up/down
    var rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("A"))
      MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    if (keyboard.pressed("D"))
      MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    if (keyboard.pressed("R"))
      MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
    if (keyboard.pressed("F"))
      MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);

    if (keyboard.pressed("Z")) {
      MovingCube.position.set(0, 25.1, 0);
      MovingCube.rotation.set(0, 0, 0);
    }

    // update the texture camera's position and look direction
    var relativeCameraOffset = new THREE.Vector3(0, 0, 1);

    var cameraOffset =
      MovingCube.matrixWorld.multiplyVector3(relativeCameraOffset);
    textureCamera.position.x = cameraOffset.x;
    textureCamera.position.y = cameraOffset.y;
    textureCamera.position.z = cameraOffset.z;

    var relativeCameraLookOffset = new THREE.Vector3(0, 0, -1);
    var cameraLookOffset = relativeCameraLookOffset.applyMatrix4(
      MovingCube.matrixWorld
    );

    textureCamera.lookAt(cameraLookOffset);

    stats.update();
  }

  function render() {
    // textureCamera is located at the position of MovingCube
    //   (and therefore is contained within it)
    // Thus, we temporarily hide MovingCube
    //    so that it does not obscure the view from the camera.

    // textureCamera位于MovingCube的位置
    //(因此包含在其中)
    //因此，我们暂时隐藏MovingCube
    //这样就不会遮挡照相机的视野。


    MovingCube.visible = false;
    // put the result of textureCamera into the first texture.
    //将textureCamera的结果放入第一个纹理。

    renderer.render(scene, textureCamera, firstRenderTarget, true);

    MovingCube.visible = true;

    // slight problem: texture is mirrored.
    //    solve problem by rendering (and hence mirroring) the texture again

    // render another scene containing just a quad with the texture
    //    and put the result into the final texture
    //小问题:纹理被镜像。
    //通过渲染(因此镜像)纹理来解决问题
    //渲染另一个场景，只包含一个带有纹理的四边形
    //并将结果放入最终纹理中
    renderer.render(screenScene, screenCamera, finalRenderTarget, true);

    // render the main scene
   // render the main scene
    renderer.render(scene, mainCamera);
  }
};
