   // The individual position vertex
    attribute vec4 position;

    void main() {
    
      // the gl_Position is the final position after the vertex shader modifies it
      gl_Position = position;
    }