//
precision mediump float;
varying vec4 v_Color;
void main(){
  gl_FragColor=vec4(v_Color); //vec4(v_Color, 1);
}