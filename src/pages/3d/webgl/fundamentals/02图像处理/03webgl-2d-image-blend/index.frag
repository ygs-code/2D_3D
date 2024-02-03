precision mediump float;

// our texture // 纹理
uniform sampler2D u_image;
// 图片宽高
uniform vec2 u_textureSize;

// the texCoords passed in from the vertex shader.
//从顶点着色器传入的texcoord。
varying vec2 v_texCoord;

void main() {
    // 计算1像素对应的纹理坐标
   vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
     // 对左中右像素求均值
   gl_FragColor = (
       texture2D(u_image, v_texCoord) +
       texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
       texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))) / 3.0;
}