attribute vec4 a_Position;
attribute vec3 a_colors;
varying vec3 v_colors;
// 列主序列
uniform mat3 u_Matrix;
void main() {
    v_colors = a_colors;
    gl_Position = vec4(u_Matrix * vec3(a_Position),
        // a_Position.z,
    a_Position.w);
    gl_PointSize = 10.;
}