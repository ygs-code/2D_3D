
// 上面这种传参实参 也行的
attribute vec4 a_Position;
// attribute vec4 a_Scale;
uniform float u_Scale;
void main(){
    
    gl_Position=vec4(a_Position.x*u_Scale,a_Position.y*u_Scale,a_Position.z*u_Scale,1.);
    gl_PointSize=10.;
}

// 下面 用对象 赋值也可以
// attribute vec4 a_Position;//声明attribute变量a_Position，用来存放顶点位置信息
// uniform float u_Scale;//声明uniform变量u_Scale，用来存放缩放比例
// void main(){
    //     gl_Position.x=a_Position.x*u_Scale;//将缩放u_Scale倍后的x坐标赋值给顶点着色器内置变量gl_Position的x坐标
    //     gl_Position.y=a_Position.y*u_Scale;//将缩放u_Scale倍后的y坐标赋值给顶点着色器内置变量gl_Position的y坐标
    //     gl_Position.z=a_Position.z*u_Scale;//将缩放u_Scale倍后的z坐标赋值给顶点着色器内置变量gl_Position的z坐标
    //     gl_Position.w=1.0;
// }
