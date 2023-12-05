    // The individual position vertex
    attribute vec3 position;

    void main() {
      
      // the gl_Position is the final position in clip space after the vertex shader modifies it
      gl_Position = vec4(position, 1.0);
    }