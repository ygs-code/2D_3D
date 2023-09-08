// attribute vec4 a_Position;
// uniform float u_CosB;
// uniform float u_SinB;
// void main() {
//     gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
//     gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
//     gl_Position.z = a_Position.z;
//     gl_Position.w = 1.0;
//     // gl_Position = a_Position
// 	// gl_Position = a_Position;
// 	// gl_PointSize = 10.0; //由于只在绘制Point的时候有效，所欲可以去掉
// }

attribute vec4 a_Position;
attribute float deg;
void main() {
    gl_Position.x = a_Position.x * cos(deg) - a_Position.y * sin(deg);
    gl_Position.y = a_Position.x * sin(deg) + a_Position.y * cos(deg);
    gl_Position = vec4(gl_Position.x, gl_Position.y, gl_Position.z, 1.0);
    gl_PointSize = 10.0;
}
