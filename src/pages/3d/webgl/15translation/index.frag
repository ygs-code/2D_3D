precision mediump float; // 设置精度
uniform vec4 u_FragColor; //声明uniform变量u_FragColor，用来存放顶点颜色信息
void main() {
   //通过u_FragColor变量设置片元颜色
    gl_FragColor = u_FragColor;
}