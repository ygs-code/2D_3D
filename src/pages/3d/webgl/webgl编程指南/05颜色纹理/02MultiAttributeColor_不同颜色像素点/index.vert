attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color; // varying variable
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
  v_Color = a_Color;  // Pass the data to the fragment shader
}
