  precision mediump float;
    
    // Passed in from the vertex shader.
    varying vec3 v_normal;
    
    // The texture.
    uniform samplerCube u_texture;
    
    void main() {
       gl_FragColor = textureCube(u_texture, normalize(v_normal));
    }