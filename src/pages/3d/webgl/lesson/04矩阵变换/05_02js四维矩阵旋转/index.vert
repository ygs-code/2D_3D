attribute vec4 a_Position;
precision mediump float;// 定义浮点变量
uniform float u_Aangle;// 定义u_Aangle变量
float rad=radians(u_Aangle);// 角度转弧度
float cosB=cos(rad);
float sinB=sin(rad);
mat4 m4=mat4(// 4x4矩阵
    cosB,sinB,0.,0.,
    -sinB,cosB,0.,0.,
    0.,0.,1.,0.,
    0.,0.,0.,1.
);
void main(){
    // gl_Position= a_Position*m4;
    gl_Position=m4*a_Position;
    gl_PointSize=10.;
}