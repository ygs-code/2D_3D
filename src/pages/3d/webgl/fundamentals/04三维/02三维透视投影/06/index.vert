attribute vec4 position;
attribute vec4 color;
uniform mat4 u_worldViewProjection;
uniform mat4 u_exampleWorldViewProjection;
varying vec4 v_color;
varying vec4 v_position;
void main() {
gl_Position = u_worldViewProjection * position;
v_position = u_exampleWorldViewProjection * position;
v_position = v_position / v_position.w;
v_color = color;
}
