

import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

class App {
    constructor() {
        const container = document.createElement('div')
        document.body.appendChild(container)

        // 投影
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 4)

        // 创建场景
        this.scene = new THREE.Scene()


        // 设置场景颜色
        this.scene.background = new THREE.Color(0xaaaaaa);

        // 半球光（HemisphereLight）
        // 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
        // 半球光不能投射阴影。
        const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
        this.scene.add(ambient);


        // 平行光（DirectionalLight）
        // 平行光是沿着特定方向发射的光。这种光的表现像是无限远，从它发出的光线都是平行的。
        // 常常用平行光来模拟太阳光的效果。 太阳足够远，因此我们可以认为太阳的位置是无限远，
        // 所以我们认为从太阳发出的光线也都是平行的。
        const light = new THREE.DirectionalLight()
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);


        // 渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( this.renderer.domElement );




          //Replace Box with Circle, Cone, Cylinder, Dodecahedron, Icosahedron, Octahedron, Plane, Sphere, Tetrahedron, Torus or TorusKnot
        //   立方缓冲几何体（BoxGeometry）
          const geometry = new THREE.BoxGeometry();
          //const geometry = this.createStarGeometry();
        //   标准网格材质(MeshStandardMaterial)
          const material = new THREE.MeshStandardMaterial( { color: 0xFF0000 });
        //   网格（Mesh）
          this.mesh = new THREE.Mesh( geometry, material );
          
          this.scene.add(this.mesh);

          
          const controls = new OrbitControls( this.camera, this.renderer.domElement );
          
          // — 每个可用帧都会调用的函数。 如果传入‘null’,所有正在进行的动画都会停止。
          // 不断的回调调用该函数
          this.renderer.setAnimationLoop(this.render.bind(this));
      
          window.addEventListener('resize', this.resize.bind(this) );


    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // 更新投影
        this.camera.updateProjectionMatrix();
        // 更新渲染
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.mesh.rotateY( 0.01 );
        this.renderer.render( this.scene, this.camera );
    }
}


document.addEventListener("DOMContentLoaded", function(){
    const app = new App();
    window.app = app;
});