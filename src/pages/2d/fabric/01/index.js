import {fabric} from 'fabric'; // browser
import panda from 'static/image/panda.png'; // node
console.log('fabric==',fabric);
window.onload = function () {
    let canvas1 = document.createElement("canvas");
    canvas1 .id='canvas';
    // canvas1.width = 500;
    // canvas1.height = 500;
    // getWebGLContext(canvas);
    document.body.appendChild(canvas1);
    let ctx = canvas1.getContext('2d');

    let  canvas = new fabric.Canvas('canvas');
    console.log('canvas==',canvas);
   // create a rectangle object
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
  });

 

const img = new Image();
img.src=panda;

img.onload=function(){
    var imgInstance = new fabric.Image(this,{  //设置图片位置和样子
        // left:100,
        // top:100,
        // width:200,
        // height:100,
        // angle:30//设置图形顺时针旋转角度
      });
      canvas.add(imgInstance);//加入到canvas中


    //   setTimeout(()=>{
    //    // show the result
    //    ctx.canvas.toBlob((blob) => {
    //     const img = new Image();
    //     img.src = URL.createObjectURL(blob);
    //     document.body.appendChild(img);
    // });

    //    const img1 = new Image();
    // let url =   canvas.toDataURL('png');
    // img1.src = url;
    // document.body.appendChild(img1);

    //   },100);

    // const img1 = new Image();
    // let url =   canvas.toDataURL('png');
    // img1.src = url;
    // document.body.appendChild(img1);
};




canvas.on('mouse:over', function (e) {
    console.log('Mouse over object:', e.target);
  });


  

  canvas.on('object:modified', function (e) {
    console.log('object:modified');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });


  canvas.on('object:rotating', function (e) {
    console.log('object:rotating');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });


  canvas.on('object:skewing', function (e) {
    console.log('object:scaling');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });

  canvas.on('object:scaling', function (e) {
    console.log('object:scaling');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });


  canvas.on('object:moving', function (e) {
    console.log('object:moving');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });

  // 事件触发
  canvas.on('after:render', function (e) {
   
    // const img1 = new Image();
    // let url =   canvas.toDataURL('png');
    // img1.src = url;
    // document.body.appendChild(img1);
  });

   
  // "add" rectangle onto canvas
  canvas.add(rect);
   
   };
  