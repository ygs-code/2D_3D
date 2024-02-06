attribute vec4 position;
varying vec4 fragColor;

uniform float elapsedTime;
uniform mat4 projectionMatrix;
uniform mat4 cameraMatrix;
uniform mat4 modelMatrix;
void main() {
  fragColor = position * 0.5 + 0.5;
  gl_Position = projectionMatrix * cameraMatrix * modelMatrix * position;
}