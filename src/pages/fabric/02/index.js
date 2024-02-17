// import { Canvas, Rect } from 'fabric'; // browser
// import { StaticCanvas, Rect } from 'fabric/node'; // node

import {fabric} from 'fabric'; // browser
 
  let canvas = null;

  let currentType = 'default';
  let downPoint = null;
  let upPoint = null;

  let currentCircle = null; // 临时圆，创建圆的时候使用

  // 初始化画板
  function initCanvas() {
    var select= document.getElementById("select");
    select.onchange=({target:{
        value
    }})=>{
        typeChange(value);
    };


    // onchange="typeChange(this.options[this.options.selectedIndex].value)"


    canvas = new fabric.Canvas('canvas',{
        isDrawingMode: true // 开启绘画模式
    });

    canvas.freeDrawingBrush.width = 20; // 画笔宽度
    canvas.on('mouse:down', canvasMouseDown);   // 鼠标在画布上按下
    canvas.on('mouse:move', canvasMouseMove);   // 鼠标在画布上移动
    canvas.on('mouse:up', canvasMouseUp);       // 鼠标在画布上松开
  }

  // 画布操作类型切换
  function typeChange(opt) {
    currentType = opt;
    switch(opt) {
      case 'default':
        canvas.selection = true;
        canvas.selectionColor = 'rgba(100, 100, 255, 0.3)';
        canvas.selectionBorderColor = 'rgba(255, 255, 255, 0.3)';
        canvas.skipTargetFind = false; // 允许选中
        break;
      case 'circle':
        canvas.selectionColor = 'transparent';
        canvas.selectionBorderColor = 'transparent';
        canvas.skipTargetFind = true; // 禁止选中
        break;
    }
  }

  // 鼠标在画布上按下
  function canvasMouseDown(e) {
    downPoint = e.absolutePointer;

    if (currentType === 'circle') {
      currentCircle = new fabric.Circle({
        top: downPoint.y,
        left: downPoint.x,
        radius: 0,
        fill: 'transparent',
        stroke: 'rgba(0, 0, 0, 0.2)'
      });

      canvas.add(currentCircle);
    }
  }

  // 鼠标在画布上移动
  function canvasMouseMove(e) {
    if (currentType === 'circle' && currentCircle) {
      const currentPoint = e.absolutePointer;

      let radius = Math.min(Math.abs(downPoint.x - currentPoint.x), Math.abs(downPoint.y - currentPoint.y)) / 2;
      let top = currentPoint.y > downPoint.y ? downPoint.y : downPoint.y - radius * 2;
      let left = currentPoint.x > downPoint.x ? downPoint.x :  downPoint.x - radius * 2;

      currentCircle.set('radius', radius);
      currentCircle.set('top', top);
      currentCircle.set('left', left);

      canvas.requestRenderAll();
    }
  }

  // 鼠标在画布上松开
  function canvasMouseUp(e) {
    upPoint = e.absolutePointer;

    if (currentType === 'circle') {
      if (JSON.stringify(downPoint) === JSON.stringify(upPoint)) {
        canvas.remove(currentCircle);
      } else {
        if (currentCircle){
          currentCircle.set('stroke', '#000');
        }
      }
      currentCircle = null;
    }
  }

  window.onload = function() {
    initCanvas();
  };
 