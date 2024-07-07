// Fragment shader for single color drawing
#ifdef GL_ES
precision mediump float;
#endif
varying vec4 v_Color;
void main(){
  // 颜色
  gl_FragColor=v_Color;
}