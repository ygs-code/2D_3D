attribute vec4 a_Position;//声明attribute变量a_Position，用来存放顶点位置信息
attribute vec4 a_Color;//声明attribute变量a_Color，用来存放顶点颜色信息
uniform mat4 u_ViewMatrix;//声明uniform变量u_ViewMatrix，用来存放视图矩阵
uniform mat4 u_ProjMatrix;// 声明正交矩阵
varying vec4 v_Color;//声明varying变量v_Color，用来向片元着色器传值顶点颜色信息
uniform mat4 u_RotationMatrix;
void main(){
  // mvp 矩阵
  gl_Position=u_ProjMatrix*u_ViewMatrix*u_RotationMatrix*a_Position;//将视图矩阵与顶点坐标相乘赋值给顶点着色器内置变量gl_Position
  // gl_Position=a_Position;//将视图矩阵与顶点坐标相乘赋值给顶点着色器内置变量gl_Position
  v_Color=a_Color;//将顶点颜色信息传给片元着色器，
}