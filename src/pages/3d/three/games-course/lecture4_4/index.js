

import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LoadingBar } from '@/pages/3d/utils/LoadingBar.js';
 

class Game{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.clock = new THREE.Clock();

        // 加载的进度条
        this.loadingBar = new LoadingBar();
        this.loadingBar.visible = false;



		// this.assetsPath = '../../assets/';
        
        /// 投影
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );
		this.camera.position.set( 1, 1.7, 2.8 );
        
		let col = 0x605550;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( col );
		
		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		this.scene.add(ambient);

        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1 );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        this.setEnvironment();
        
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        controls.target.set(0, 1, 0);
		controls.update();

        this.loadEve();
		
		window.addEventListener('resize', this.resize.bind(this) );
        
	}
	
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }
    
    setEnvironment(){
        const loader = new RGBELoader()   //.setPath(this.assetsPath);
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        const self = this;
        
        loader.load( '/static/file/hdr/factory.hdr', ( texture ) => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          console.log('模型加载成功')
          self.scene.environment = envMap;

        }, undefined, (err)=>{
            console.error( err.message );
        } );
    }

    loadEve(){
    	
	}			
    
	newAnim(){
		
	}

	set action(name){
		
	}

	render() {
		const dt = this.clock.getDelta();

        this.renderer.render( this.scene, this.camera );
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const app = new Game();
    window.app = app;
});
