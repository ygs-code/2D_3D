attribute vec4 a_position;
attribute vec4 a_colors;

uniform mat4 u_matrix;

varying vec4 v_colors;
void main() {
  v_colors = a_colors;
      // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
}