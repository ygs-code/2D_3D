attribute vec4 a_Position;  // 声明a_Position变量
attribute float a_PointSize; // 声明a_PointSize变量
varying vec4 v_Color;  // 声明中间变量 v_Color
void main() {
        // vec4 表示是由4位float小数组成
    gl_Position = a_Position;
    v_Color = a_Position;  // 将a_Position赋值给v_Color
        // vec4(
        //   0.0,  // x 轴
        //   0.0,  // y轴
        //   0.0,   // z 轴
        //   1.0  // 偏移量缩放参数 但这个值最小值不能小于0
        //   );  // 表示顶点颜色的位置
    gl_PointSize = a_PointSize;   //w 表示顶点颜色的尺寸，设置越大，这个像素就会越大
}