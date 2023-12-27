
attribute vec4 a_position;
attribute vec4 a_colors;

uniform mat4 u_matrix;
uniform float u_fudgeFactor;

varying vec4 v_colors;

void main(){
  // Multiply the position by the matrix.  //将位置乘以矩阵。
  vec4 position=u_matrix*a_position;
  
  // Adjust the z to divide by 调整z来除以
  float zToDivideBy=1.+position.z*u_fudgeFactor;
  
  // Divide x and y by z. 用x和y除以z。
  // gl_Position=vec4(position.xy/zToDivideBy,position.zw);
  gl_Position=vec4(position.xyz,zToDivideBy);
  
  // Pass the color to the fragment shader.
  v_colors=a_colors;
}