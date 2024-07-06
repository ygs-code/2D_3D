import THREE from "./three";
import * as dat from "dat.gui";
// 导入轨道控制器

import Detector from "./Detector";
import Stats from "./stats";
import { astar, Graph } from "./astar";
// 导入动画库
import gsap from "gsap";

console.log('THREE==', THREE)


window.onload = () => {
  var container,
    scene,
    camera,
    renderer,
    controls,
    stats
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000;
  var windowWidth, windowHeight;
  var length = 100,
  // var length = 200,
    flex = 2;
  var graph = [];
  threeStart();

  function threeStart() {
    // 初始化Three
    initThree();
    // 初始化场景
    initScene();
    // 初始化相机
    initCamera();
    // 初始化光
    initLight();
    // 初始化场景 棋盘
    initGround();

    initGrid();
    initControl();
    initStatus();
    renderer.clear();
    animate();
  }

  function initThree() {
    if (Detector.webgl) {
      // 初始化渲染器
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
    }else {
      renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
  }

  function initCamera() {

    // 初始化相机
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 200, 250);
    camera.lookAt(scene.position);
  }

  function initScene() {
    // 初始化场景
    scene = new THREE.Scene();
  }

  function initLight() {
    // 初始化光
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
  }
  //播放动画请去掉注释
  //var isMoved;
  //var isMoved2;
  //var i;
  //var geometry;
  //var line,line2,rota;
  //function groundAnimate(){
  //	
  //	if(i>length/10){
  //		return;
  //	}
  //	if(!isMoved){
  //		scene.add(line);
  //		isMoved=true;
  //	}
  //	if(line.position.z>( i * 10 ) - length/2){
  //			line.position.z-=2;
  //		}else if(line.position.z<( i * 10 ) - length/2){
  //			line.position.z+=2;
  //		}else{
  ////			i++;
  ////			isMoved=false;
  ////			isMoved2=false;
  ////			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x808080, opacity: 1 } ) );
  //			//var line2=new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x808080, opacity: 1 } ) );
  //			if(!isMoved2){
  //				scene.add(line2);
  //				isMoved2=true;
  //			}
  //			if(line2.position.x<( i * 10 ) - length/2){
  //				line2.position.x+=1;
  //			}else if(line2.position.x>( i * 10 ) - length/2){
  //				line2.position.x-=1;
  //			}else{
  //				if(line2.rotation.y<90 * Math.PI / 180){
  //					line2.rotation.y+=10*Math.PI/180;
  //				}else if(line2.rotation.y>90 * Math.PI / 180){
  //					line2.rotation.y-=10*Math.PI/180;
  //				}else{
  //					i++;
  //				isMoved=false;
  //				isMoved2=false;
  //				line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x808080, opacity: 1 } ) );
  //				line2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x808080, opacity: 1 } ) );
  //				}
  //				
  //				
  //			}
  //		}
  //	
  //    requestAnimationFrame( groundAnimate );
  //	
  //}
  // 初始化场景 棋盘
  function initGround() {
    //播放动画请去掉注释
    // lines
    //isMoved=false;
    //isMoved2=false;
    //i=0;
    //line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x808080, opacity: 1 } ) );
    //line2 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x808080, opacity: 1 } ) )
    //groundAnimate()

    // 初始化网格模型
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-length / 2, 0, 0));
    geometry.vertices.push(new THREE.Vector3(length / 2, 0, 0));

    //播放动画请注释一下内容			
    for (var i = 0; i <= length / 10; i++) {

       // 添加线
      var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x808080,
        opacity: 1
      }));
      line.position.z = (i * 10) - length / 2;
      scene.add(line);

      var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x808080,
        opacity: 1
      }));
      line.position.x = (i * 10) - length / 2;
      line.rotation.y = 90 * Math.PI / 180;
      scene.add(line);

    }
    // 矩形 西面矩形
    var geometry = new THREE.PlaneGeometry(length, 10);

    var material = new THREE.MeshBasicMaterial({
      color: 0x808080,
      side: THREE.DoubleSide
    });

    var plane1 = new THREE.Mesh(geometry, material);
    plane1.position.set(0, 5, length / 2);
    scene.add(plane1);

    var plane2 = new THREE.Mesh(geometry, material);
    plane2.rotation.y = 90 * Math.PI / 180;
    plane2.position.set(length / 2, 5, 0);
    scene.add(plane2);

    var plane3 = new THREE.Mesh(geometry, material);
    plane3.position.set(0, 5, -length / 2);
    scene.add(plane3);

    var plane4 = new THREE.Mesh(geometry, material);
    plane4.rotation.y = 90 * Math.PI / 180;
    plane4.position.set(-length / 2, 5, 0);
    scene.add(plane4);

    // 立方体（CubeGeometry），但它其实是长方体 背景
    var skyBoxGeometry = new THREE.CubeGeometry(200, 5, 200);

  // 材质 
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      side: THREE.BackSide
    });

    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);

  }

  function initControl() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  }

  // 立方体 模型
  function initGrid() {

     // 立方体（CubeGeometry），但它其实是长方体 背景
    var geometry = new THREE.CubeGeometry(8, 8, 8);

    var material = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });

    for (var i = 0; i < length / 10; i++) {
      var nodeRow = [];

      graph.push(nodeRow);

      for (var j = 0; j < length / 10; j++) {

        var salt = randomNum(1, 7);
        if (salt > flex) {
          nodeRow.push(1);
        } else {
          nodeRow.push(0);
        }
        if (salt <= flex) {
          var cube = new THREE.Mesh(geometry, material);
          cube.position.set(10 * j - length / 2 + 5, 5, 10 * i - length / 2 + 5);
          scene.add(cube);
        }
        
      }
    }

    console.log('graph==',graph)
  }

  var resultArray = new Array();

  function pickupObjects(e) {

    var raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    var fxl = new THREE.Vector3(0, 1, 0);

    var groundplane = new THREE.Plane(fxl, 0);

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //从相机发射一条射线，经过鼠标点击位置
    raycaster.setFromCamera(mouse, camera);
    //计算射线相机到的对象，可能有多个对象，因此返回的是一个数组，按离相机远近排列
    var ray = raycaster.ray;
    let intersects = ray.intersectPlane(groundplane);
    let x = intersects.x;
    let z = intersects.z;
    

    if (Math.abs(x) > length / 2 || Math.abs(z) > (length / 2)) {
      return;
    }

    var k, m;
    for (var i = -length / 2; i < length / 2; i += 10) {
      if (x >= i && x < i + 10) {
        k = i + 5;
      }
    }
    for (var j = -length / 2; j < length / 2; j += 10) {
      if (z >= j && z < j + 10) {
        m = j + 5;
      }
    }

    initSphere(k, m);
  }

  document.addEventListener('click', pickupObjects, false);

  var isCaculate = false;
  function cleanSphere() {
    let child = scene.children;
    for (var i = 0; i < child.length; i++) {
      if (child[i].geometry instanceof THREE.SphereGeometry) {
        scene.remove(child[i]);
        i--;
      }
    }
    isCaculate = false;
  }
  function initSphere(x, z) {

    if (isCaculate) {
      cleanSphere();
    }

    var geometry = new THREE.SphereGeometry(5, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    if (resultArray.length == 0) {
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = x;
      sphere.position.y = 5;
      sphere.position.z = z;
      resultArray.push(sphere);
      scene.add(sphere);
    } else if (resultArray[0].position.x != x && resultArray[0].position.z != z) {
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = x;
      sphere.position.y = 5;
      sphere.position.z = z;
      resultArray.push(sphere);
      scene.add(sphere);
      caculatePath(resultArray);
      isCaculate = true;
      //			console.log("起始点坐标为  x:"+resultArray[0].position.x+",z:"+resultArray[0].position.z);
      //			console.log("终止点坐标为  x:"+resultArray[1].position.x+",z:"+resultArray[1].position.z);
      resultArray = new Array();
    }

  }
  var result;
  function caculatePath(resultArray) {
    //console.log(resultArray);
    var maps = new Graph(graph);
    var startX = (resultArray[0].position.z - 5 + length / 2) / 10;
    var startY = (resultArray[0].position.x - 5 + length / 2) / 10;
    var endX = (resultArray[1].position.z - 5 + length / 2) / 10;
    var endY = (resultArray[1].position.x - 5 + length / 2) / 10;
    //console.log(startX+' '+startY+' '+endX+' '+endY);

    var start = maps.grid[startX][startY];
    var end = maps.grid[endX][endY];

    result = astar.search(maps, start, end);

    if (result.length == 0) {
      alert("无可到达路径");
      cleanSphere();
      return;
    }
    //	    var timesRun = 0;
    timesRun = 0;
    tempSphere = resultArray[0];
    pathAnimate();
    //		var interval = setInterval(function(){
    //			var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    //			var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    //			var sphere = new THREE.Mesh( geometry, material );
    //			sphere.position.x=result[timesRun].y*10-length/2+5;
    //			sphere.position.y=5;
    //			sphere.position.z=result[timesRun].x*10-length/2+5;
    //			scene.add( sphere );
    //			timesRun += 1;
    //			if(timesRun == result.length){
    //			    clearInterval(interval);
    //			    }			
    //			}, 200);

  }

  var timesRun = 0;
  var tempSphere;
  var isAdded = false;
  function pathAnimate() {
    if (!isAdded) {
      scene.add(tempSphere);
      isAdded = true;
    }
    if (timesRun == result.length) {
      return;
    }
    var next = {
      x: result[timesRun].y * 10 - length / 2 + 5,
      z: result[timesRun].x * 10 - length / 2 + 5
    }
    if (tempSphere.position.x == next.x && tempSphere.position.z == next.z) {
      timesRun++;
      requestAnimationFrame(pathAnimate);
      return;
    }
    if (tempSphere.position.x > next.x) tempSphere.position.x -= 1;
    if (tempSphere.position.x < next.x) tempSphere.position.x += 1;
    if (tempSphere.position.z > next.z) tempSphere.position.z -= 1;
    if (tempSphere.position.z < next.z) tempSphere.position.z += 1;
    requestAnimationFrame(pathAnimate);

  }

  function randomNum(minNum, maxNum) {

    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  }

  function initStatus() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
  }

  function updateSize() {
    if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      renderer.setSize(windowWidth, windowHeight);
    }
  }

  function animate() {
    render();
    controls.update();
    stats.update();
    requestAnimationFrame(animate);
  }

  function render() {
    updateSize();
    renderer.render(scene, camera);
  }
}