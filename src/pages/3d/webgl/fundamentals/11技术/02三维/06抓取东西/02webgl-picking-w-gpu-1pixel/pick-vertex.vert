    attribute vec4 a_position;
    
    uniform mat4 u_viewProjection;
    uniform mat4 u_world;
    
    void main() {
      // Multiply the position by the matrices
      gl_Position = u_viewProjection * u_world * a_position;
    }