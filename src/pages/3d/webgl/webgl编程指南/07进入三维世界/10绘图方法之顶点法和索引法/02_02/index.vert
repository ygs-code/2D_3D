attribute vec4 aPosition;
attribute vec4 aColor;
varying vec4 vColor;

uniform mat4 mat;
void main(){
    gl_Position=mat*aPosition;
    vColor=aPosition;
}