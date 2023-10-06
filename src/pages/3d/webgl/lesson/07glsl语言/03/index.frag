//
precision mediump float;

// 计算两点之间的距离
float getDiatance(vec2 p1,vec2 p2){
  return sqrt(pow(p1.x-p2.x,2.)+pow(p1.y-p2.y,2.));
}

void main(){
  /*
  片段着色器变量
  
  gl_FragCoord:
  我们已经见过gl_FragCoord很多次了，因为gl_FragCoord的z分量等于对应片段的深度值。然而，我们也能使用它的x和y分量来实现一些有趣的效果。
  
  gl_FragCoord的x和y分量是片段的窗口空间(Window-space)坐标，其原点为窗口的左下角。我们已经使用glViewport设定了一个800x600的窗口了，所以片段窗口空间坐标的x分量将在0到800之间，y分量在0到600之间。
  
  通过利用片段着色器，我们可以根据片段的窗口坐标，计算出不同的颜色。gl_FragCoord的一个常见用处是用于对比不同片段计算的视觉输出效果，这在技术演示中可以经常看到。比如说，我们能够将屏幕分成两部分，在窗口的左侧渲染一种输出，在窗口的右侧渲染另一种输出。下面这个例子片段着色器会根据窗口坐标输出不同的颜色：
  你可以将它用于测试不同的光照技巧。
  gl_FragCoord.x/400 是等于1
  gl_FragCoord.y/400 是等于1
  -1 到 1 中心点是 0
  */
  float x=(gl_FragCoord.x/400.-.5)*2.; // 如果改变2.0 则下面的if 0.5也要改变
  float y=(gl_FragCoord.y/400.-.5)*2.;
  float r=0.;
  float g=.5;
  float b=.5;
  
  vec3 color=vec3(r,g,b);
  vec3 color1=vec3(1.,1.,1.);
  vec3 color2=vec3(0.,0.,1.);
  
  float dis=getDiatance(vec2(x,y),vec2(0.,0.));
  
  if(dis>0.5){
    gl_FragColor=vec4(color1-color2,1.);
  }else{
    gl_FragColor=vec4(x,y,1.,1.);
  }
  
}