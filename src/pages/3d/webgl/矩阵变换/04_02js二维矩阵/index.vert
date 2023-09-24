attribute vec4 a_Position;
precision mediump float;// 定义浮点变量
uniform float u_Aangle;// 定义u_Aangle变量
float rad=radians(u_Aangle); // 角度转弧度
float cosB=cos(rad);
float sinB=sin(rad);
mat2 m2=mat2(  // 2x2矩阵
    cosB,sinB,
    -sinB,cosB
);
void main(){
    gl_Position=vec4(
        m2*vec2(a_Position),
        a_Position.z,
        a_Position.w
    );
}