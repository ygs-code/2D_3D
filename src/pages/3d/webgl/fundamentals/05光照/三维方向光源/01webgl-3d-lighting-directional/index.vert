attribute vec4 a_position;  // 模型顶点位置
attribute vec3 a_normal;  // 光法线
 
uniform mat4 u_matrix;  // 模型矩阵 mvp矩阵 用于线性变换的

varying vec3 v_normal;

void main() {
  // Multiply the position by the matrix.
  // 将位置乘以矩阵。
  gl_Position = u_matrix * a_position;

  // Pass the normal to the fragment shader
  // 将法线传递给片段着色器
  v_normal = a_normal;
}