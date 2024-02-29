precision mediump float;

// Passed in from the vertex shader. 
varying vec3 v_normal; //  从顶点着色器传入。

uniform vec3 u_reverseLightDirection; // 光方向
uniform vec4 u_color; // 物体表面 基底色

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again

//因为v_normal是一个变量，所以它被插值
//所以它不是单位向量。规范它
//将使它再次成为单位向量

 // 归一化
  vec3 normal = normalize(v_normal);

    // Dot product of the light direction and the orientation of a surface (the normal)
  //光照方向与曲面方向(法线)的点积
  // max 最大值，如果点积小于0则 用 0 
  /*
  平行光漫反射
     漫反射颜色 = 入射光颜色 * 表面基底色 * (光线方向 * 法线方向)

  入射反方向和法线夹角  θ = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
  
  dot 是计算两个矢量的点积<光线方向>*<法线向量> 
    该函数接收两个矢量作为参数，返回他们的点积

  diffuse = u_LightColor * a_Color.rgb * nDotL = 入射光颜色 * 表面基底色 * 入射和法线夹角


  */

// 
  // float light = dot(normal, u_reverseLightDirection);

  // 夹角  入射反方向和法线夹角  θ = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
  float light = max(dot(normal, u_reverseLightDirection), 0.);

  // gl_FragColor = u_color;

  // // Lets multiply just the color portion (not the alpha)
  // // by the light
  // gl_FragColor.rgb *= light;

  gl_FragColor = vec4(u_color.rgb * light, u_color.a);
}