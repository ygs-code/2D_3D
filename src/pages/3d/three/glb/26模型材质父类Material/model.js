import * as THREE from 'three';



// const geometry = new THREE.BoxGeometry(100, 100, 100);
const geometry = new THREE.PlaneGeometry(100, 60);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    // transparent:true,
    // opacity:0.5,
});
material.transparent = true;//开启透明
material.opacity = 0.5;//设置透明度
// material.side = THREE.BackSide;//背面可以看到
material.side = THREE.DoubleSide;//双面可见
const mesh = new THREE.Mesh(geometry, material);

export default mesh;