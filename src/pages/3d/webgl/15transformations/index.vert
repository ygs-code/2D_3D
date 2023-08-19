attribute vec4 a_Position;  //声明attribute变量a_Position，用来存放顶点位置信息
uniform vec4 u_Translation;  //声明uniform变量u_Translation，用来存放平移信息
void main(){
    gl_Position = a_Position + u_Translation; //将平移后的坐标赋值给顶点着色器内置变量gl_Position
}