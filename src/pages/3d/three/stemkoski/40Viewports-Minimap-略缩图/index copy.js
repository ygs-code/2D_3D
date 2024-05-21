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
  /*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/

  // MAIN

  // standard global variables
  var container, scene, renderer, controls, stats;
  var keyboard = new KeyboardState();
  var clock = new THREE.Clock();

  // custom global variables
  var MovingCube;
  var perspectiveCamera, topCamera, frontCamera, sideCamera;

  init();
  animate();

  // FUNCTIONS
  function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = 0.1,
      FAR = 20000;

    // perspective cameras
    // 透视投影
    perspectiveCamera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR
    );
    perspectiveCamera.position.set(0, 200, 550);
    // 设置相机位置
    perspectiveCamera.lookAt(scene.position);
    // 相机添加到场景中
    scene.add(perspectiveCamera);

    // orthographic cameras
    // 顶部相机 正交投影
    /*
      如果是单独一个相机 参数则是

      window.innerWidth * -1, // Left
      window.innerWidth , // Right
      window.innerHeight , // Top
      window.innerHeight * -1, // Bottom
    
    */
    topCamera = new THREE.OrthographicCamera(
      
      window.innerWidth / -4, // Left
      window.innerWidth / 4, // Right
      window.innerHeight / 4, // Top
      window.innerHeight / -4, // Bottom
      -5000, // Near
      10000
    ); // Far -- enough to see the skybox
    topCamera.up = new THREE.Vector3(0, 0, -1);
    topCamera.lookAt(new THREE.Vector3(0, -1, 0));
    // 相机添加到投影中
    scene.add(topCamera);

    // 前面相机 正交投影
    frontCamera = new THREE.OrthographicCamera(
      window.innerWidth / -4,
      window.innerWidth / 4,
      window.innerHeight / 4,
      window.innerHeight / -4,
      -5000,
      10000
    );
    frontCamera.lookAt(new THREE.Vector3(0, 0, -1));
    scene.add(frontCamera);

    // 正交投影
    sideCamera = new THREE.OrthographicCamera(
      window.innerWidth / -4,
      window.innerWidth / 4,
      window.innerHeight / 4,
      window.innerHeight / -4,
      -5000,
      10000
    );
    sideCamera.lookAt(new THREE.Vector3(1, 0, 0));
    scene.add(sideCamera);

    // RENDERER
    if (Detector.webgl) {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } else {
      renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.body;

    container.appendChild(renderer.domElement);
    // EVENTS
    WindowResize(renderer, topCamera);
    FullScreen.bindKey({ charCode: "m".charCodeAt(0) });

    // CONTROLS
    // controls = ...

    // STATS
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);
    // FLOOR
    // 加载底部 纹理
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

    // SKYBOX/FOG  背景
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
      color: 0x9999ff,
      side: THREE.BackSide
    });



    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);
    debugger


    ////////////
    // CUSTOM //
    ////////////
    scene.add(new THREE.AxisHelper(100));

    // create an array with six textures for a cool cube
    // 移动盒子
    var materialArray = [];
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(xpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(xneg)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(ypos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(yneg)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(zpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(zneg)
      })
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

     // 光
    var ambientlight = new THREE.AmbientLight(0x111111);
    scene.add(ambientlight);
    // 基础网格材质(MeshBasicMaterial)
    var wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true
    });

    // torus knot
    // Phong网格材质(MeshPhongMaterial)
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
    var shape4= THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 4),
      [colorMaterial4, wireMaterial]
    );
    shape4.position.set(-200, 50, 200);
    scene.add(shape4);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColorHex(0x000000, 1);
    renderer.autoClear = false;
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

    stats.update();
  }

  function render() {
    var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight;

    // setViewport parameters:
    //  lower_left_x, lower_left_y, viewport_width, viewport_height
    renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.clear();

    // 左边
    // upper left corner
    renderer.setViewport(
      1,
      0.5 * SCREEN_HEIGHT + 1,
      0.5 * SCREEN_WIDTH - 2,
      0.5 * SCREEN_HEIGHT - 2
    );

    renderer.render(scene, perspectiveCamera);


     // 右边视图
    // upper right corner
    renderer.setViewport(
      0.5 * SCREEN_WIDTH + 1,
      0.5 * SCREEN_HEIGHT + 1,
      0.5 * SCREEN_WIDTH - 2,
      0.5 * SCREEN_HEIGHT - 2
    );
    renderer.render(scene, topCamera);



     // 下面的左边
    // lower left corner
    renderer.setViewport(1, 1, 0.5 * SCREEN_WIDTH - 2, 0.5 * SCREEN_HEIGHT - 2);
    renderer.render(scene, sideCamera);


    // 下面的右边
    // lower right corner
    renderer.setViewport(
      0.5 * SCREEN_WIDTH + 1,
      1,
      0.5 * SCREEN_WIDTH - 2,
      0.5 * SCREEN_HEIGHT - 2
    );
    renderer.render(scene, frontCamera);
  }
};
