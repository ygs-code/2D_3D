attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
  //  将矩形从像素转换为0.0到1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2 从0->1转换为0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   //从0->2转换为-1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   //将texCoord传递给片段着色器
  // GPU将在点之间插入这个值。
   v_texCoord = a_texCoord;
}