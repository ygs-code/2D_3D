// Fog_w.js (c) 2012 matsuda and ohnishi
// Vertex shader program

attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
varying float v_Dist;
void main() {
  gl_Position = u_MvpMatrix * a_Position;
  v_Color = a_Color;
     // Use the negative z value of each vertex in view coordinate system
  v_Dist = gl_Position.w;
}