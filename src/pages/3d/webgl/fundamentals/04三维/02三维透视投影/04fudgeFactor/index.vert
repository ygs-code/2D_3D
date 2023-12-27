attribute vec4 a_position;
attribute vec4 a_colors;

uniform mat4 u_matrix;
// uniform float u_fudgeFactor;

varying vec4 v_colors;

void main() {
  // Multiply the position by the matrix.  //将位置乘以矩阵。
  vec4 position = u_matrix * a_position;
  gl_Position = position;

  // Pass the color to the fragment shader.
  v_colors = a_colors;
}