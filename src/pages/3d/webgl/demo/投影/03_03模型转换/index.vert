    // Each point has a position and color
attribute vec3 position;
attribute vec4 color;

    // The transformation matrix
// uniform mat4 model;
uniform mat4 u_scaleMatrix;
uniform mat4 u_rotationMatrix;
uniform mat4 u_translationMatrix;
mat4 model;
    // Pass the color attribute down to the fragment shader
varying vec4 vColor;

void main() {
  /*
    模型矩阵 = 缩放矩阵 * 旋转矩阵 * 偏移矩阵
  */  
  model = u_translationMatrix * u_rotationMatrix * u_scaleMatrix;
      //Pass the color down to the fragment shader
  vColor = color;

      // Multiply the 
  gl_Position = model * vec4(position, 1);
}