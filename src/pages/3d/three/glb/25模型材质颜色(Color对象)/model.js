import * as THREE from 'three';


const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
});
const mesh = new THREE.Mesh(geometry, material);

// 浏览器控制台查看材质颜色属性的属性值
console.log('material.color',material.color);

// 十六进制颜色
material.color.set(0x00ff00);

// 前端CSS风格颜色值：'#00ff00'、'rgb(0,255,0)'等形式
// material.color.set('#00ff00');
// material.color.set('rgb(0,255,0)');


export default mesh;