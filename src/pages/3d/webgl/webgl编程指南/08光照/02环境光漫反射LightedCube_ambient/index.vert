attribute vec4 a_Position;  // 顶点位置
attribute vec4 a_Color;  // 物体颜色 表面基底 颜色
attribute vec4 a_Normal;       // Normal  法线
uniform mat4 u_MvpMatrix;    // 模型
uniform vec3 u_DiffuseLight;   // Diffuse light color   漫射光色
uniform vec3 u_LightDirection; // 光方向 Diffuse light direction (in the world coordinate, normalized)  漫射光方向(世界坐标，归一化)
uniform vec3 u_AmbientLight;   // Color of an ambient light  环境光的颜色
varying vec4 v_Color;  // 物体颜色
void main() {
  /*
     入射反方向和法线夹角 = nDotL = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
 1. 
    环境反射光颜色 =              环境入射光颜色 * 表面基底颜色
    环境反射光颜色 =  ambient = u_AmbientLight * a_Color.rgb
   
 2. 
    漫反射光颜色 =            漫反射光颜色     *   表面基地色    *    入射反方向和法线夹角    
    漫反射光颜色 =  diffuse = u_DiffuseLight * a_Color.rgb * nDotL;
  

 3 .
  表面的发射光颜色 = 漫反射光颜色 + 环境反射光颜色            a_Color.a 是透明度
  v_Color = vec4(diffuse + ambient, a_Color.a);

 
  */
   gl_Position = u_MvpMatrix * a_Position;  // 物体顶点

     // Make the length of the normal 1.0
     //设置标准的长度为1.0
  vec3 normal = normalize(a_Normal.xyz);
     // The dot product of the light direction and the normal (the orientation of a surface)
     //光照方向与法线(曲面的方向)的点积
  float nDotL = max(dot(u_LightDirection, normal), 0.0);

     // Calculate the color due to diffuse reflection
   //计算漫反射的颜色
  vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL;

   // Calculate the color due to ambient reflection
  //根据环境反射计算颜色   
  vec3 ambient = u_AmbientLight * a_Color.rgb;
     // Add the surface colors due to diffuse reflection and ambient reflection
   //根据漫反射和环境反射添加表面颜色  讲以上两者相加得到物体最终颜色
  v_Color = vec4(diffuse + ambient, a_Color.a);
}