    // Each point has a position and color
    attribute vec3 position;
    attribute vec4 color;
    
    // The transformation matrix
    uniform mat4 model;

    // Pass the color attribute down to the fragment shader
    varying vec4 vColor;

    void main() {
      
      //Pass the color down to the fragment shader
      vColor = color;
      
      // Multiply the 
      gl_Position = model * vec4(position, 1.0);
    }