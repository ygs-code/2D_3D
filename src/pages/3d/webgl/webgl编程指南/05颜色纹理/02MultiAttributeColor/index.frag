// Fragment shader program

  #ifdef GL_ES
precision mediump float; // Precision qualifier (See Chapter 6)
  #endif GL_ES
varying vec4 v_Color;    // Receive the data from the vertex shader
void main() {
  gl_FragColor = v_Color;
}