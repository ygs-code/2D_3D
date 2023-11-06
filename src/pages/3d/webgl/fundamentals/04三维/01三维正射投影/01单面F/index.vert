attribute vec4 a_position;

uniform mat4 u_matrix;

void main() {
      // Multiply the position by the matrix.
      // 矩阵乘以顶点
   gl_Position = u_matrix * a_position;
}