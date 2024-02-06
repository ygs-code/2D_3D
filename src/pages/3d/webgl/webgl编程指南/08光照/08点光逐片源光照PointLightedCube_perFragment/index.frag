// Fragment shader program

  #ifdef GL_ES
precision mediump float;
  #endif
uniform vec3 u_LightColor;     // Light color 光照颜色
uniform vec3 u_LightPosition;  //光照位置 Position of the light source
uniform vec3 u_AmbientLight;   //环境光颜色 Ambient light color
varying vec3 v_Normal; // 法向量
varying vec3 v_Position;  // 物体顶点位置
varying vec4 v_Color; // 物体表面基地色
void main() {
     // Normalize the normal because it is interpolated and not 1.0 in length any more
     //规范化法线，因为它是插值的，不再是1.0长度
  vec3 normal = normalize(v_Normal);
     // Calculate the light direction and make its length 1.
     //计算光的方向，使其长度为1。
     /*
       光照的位置 减去 顶点位置
     */
  vec3 lightDirection = normalize(u_LightPosition - v_Position);

     // The dot product of the light direction and the orientation of a surface (the normal)
     //光方向与曲面方向(法线)的点积
  float nDotL = max(dot(lightDirection, normal), 0.0);
     // Calculate the final color from diffuse reflection and ambient reflection
     //根据漫反射和环境反射计算最终颜色
  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;

    // 点光
  vec3 ambient = u_AmbientLight * v_Color.rgb;

  gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}