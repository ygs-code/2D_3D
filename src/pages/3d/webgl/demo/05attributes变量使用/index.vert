attribute vec4 a_Position;// 声明a_Position变量
attribute float a_PointSize;// 声明a_PointSize变量
void main(){
    // vec4 表示是由4位float小数组成
    gl_Position=a_Position;
    // vec4(
        //   0.0,  // x 轴
        //   0.0,  // y轴
        //   0.0,   // z 轴
        //   1.0  // 偏移量缩放参数 但这个值最小值不能小于0
    //   );  // 表示顶点颜色的位置
    gl_PointSize=a_PointSize;//w 表示顶点颜色的尺寸，设置越大，这个像素就会越大
}