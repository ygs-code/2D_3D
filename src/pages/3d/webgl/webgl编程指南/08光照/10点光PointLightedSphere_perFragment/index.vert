// PointLightedCube_perFragment.js (c) 2012 matsuda and kanda
// Vertex shader program

attribute vec4 a_Position;
// attribute vec4 a_Color; // Defined constant in main()
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;// Model matrix
uniform mat4 u_NormalMatrix;// Transformation matrix of the normal
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
void main(){
  vec4 color=vec4(1.,1.,1.,1.);// Sphere color
  gl_Position=u_MvpMatrix*a_Position;
  // Calculate the vertex position in the world coordinate
  v_Position=vec3(u_ModelMatrix*a_Position);
  v_Normal=normalize(vec3(u_NormalMatrix*a_Normal));
  v_Color=color;
}