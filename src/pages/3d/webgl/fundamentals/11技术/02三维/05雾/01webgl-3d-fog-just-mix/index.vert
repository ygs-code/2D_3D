    // 顶点位置
    attribute vec4 a_position;
    // 贴图
    attribute vec2 a_texcoord;
    
    uniform mat4 u_matrix;
    
    varying vec2 v_texcoord;
    
    void main() {
      //
      // Multiply the position by the matrix.
      // 顶点位置
      gl_Position = u_matrix * a_position;
    
      // Pass the texcoord to the fragment shader.
      v_texcoord = a_texcoord;
    }