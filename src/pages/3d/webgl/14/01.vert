attribute vec2 a_Position;
uniform vec4 u_translate;
void main() {
    //  gl_Position = vec4(a_Position,0.0,1.0) + vec4(0.5, 0.5, 0.0, 0.0);
    // 用对象 引用
    // gl_Position = vec4(a_Position.x,a_Position.y,  0.0,1.0) + vec4(0.5, 0.5, 0.0, 0.0);
    gl_Position = vec4(a_Position, 0., 1.) + u_translate;
    gl_PointSize = 10.;
}