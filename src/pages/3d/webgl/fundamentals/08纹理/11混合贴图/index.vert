attribute vec4 a_Position;
attribute vec2 a_UV;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 offsetMatrix;
varying vec2 A_UV;
void main(){
  gl_Position=projectionMatrix*modelViewMatrix*offsetMatrix*a_Position;
  A_UV=a_UV;
}