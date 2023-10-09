attribute vec2 a_position;

uniform mat3 u_matrix;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
//   将位置乘以矩阵。
   gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

  // Convert from clipspace to colorspace.
  // Clipspace goes -1.0 to +1.0
  // Colorspace goes from 0.0 to 1.0
  //从clipspace转换为colorspace。
// Clipspace从-1.0到+1.0
// Colorspace从0.0到1.0
 /*
  矩阵乘以一个数的运算法则是将矩阵内的每一项都乘以这个常数，我们来看一个二阶矩阵的数乘例子例子：
  矩阵 A = [4, 5 ,6]
  用2和矩阵A相乘，得到2A，则
   2A=[8 ,10 ,12]


   // 矩阵相加一个数
   A=[8 ,10 ,12] + 0.5
   A=[8.5 ,10.5 ,12.5]  
 */
   v_color = gl_Position * 0.5 + 0.5;
}
