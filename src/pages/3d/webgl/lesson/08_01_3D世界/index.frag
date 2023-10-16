//片元着色器
#ifdef GL_ES
precision mediump float;// 设置精度
#endif
varying vec4 v_Color;//声明varying变量v_Color，用来接收顶点着色器传送的片元颜色信息
void main(){
  //将varying变量v_Color接收的颜色信息赋值给内置变量gl_FragColor
  gl_FragColor=v_Color;
}