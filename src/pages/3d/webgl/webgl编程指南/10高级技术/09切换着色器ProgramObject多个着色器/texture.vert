// 顶点位置
attribute vec4 a_Position;
// 法线 
attribute vec4 a_Normal;
// 贴图颜色
attribute vec2 a_TexCoord;
// mvp 矩阵
uniform mat4 u_MvpMatrix;
// 法线矩阵
uniform mat4 u_NormalMatrix;
// 
varying float v_NdotL;
varying vec2 v_TexCoord;
void main(){



 /* 
   法线矩阵 * 法线
      法线 = normal = normalize(vec3(u_NormalMatrix * a_Normal));


      入射反方向和法线夹角 = nDotL = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
   1. 
      环境反射光颜色 =               环境入射光颜色 * 表面基底颜色
      环境反射光颜色 =  ambient = u_AmbientLight * a_Color.rgb

   2. 
      漫反射光颜色 =            漫反射光颜色   *   表面基地色  *  入射反方向和法线夹角    
      漫反射光颜色 =  diffuse = u_LightColor * a_Color.rgb * nDotL;

   3.
   表面的发射光颜色 = 漫反射光颜色 + 环境反射光颜色            a_Color.a 是透明度
   v_Color = vec4(diffuse + ambient, a_Color.a);

 

     // Recalculate the normal based on the model matrix and make its length 1.
    //根据模型矩阵重新计算法线，使其长度为1。
   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));

     // Calculate the dot product of the light direction and the orientation of a surface (the normal)

   //   计算光线方向与表面方向(法线)的点积。
   float nDotL = max(dot(u_LightDirection, normal), 0.0);

     // Calculate the color due to diffuse reflection
   //   计算漫反射的颜色
   vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;

     // Calculate the color due to ambient reflection
     //根据环境反射计算颜色
   vec3 ambient = u_AmbientLight * a_Color.rgb;
     // Add the surface colors due to diffuse reflection and ambient reflection
     //根据漫反射和环境反射添加表面颜色
   v_Color = vec4(diffuse + ambient, a_Color.a);



*/

 // 物体的顶点位置
  gl_Position=u_MvpMatrix*a_Position;

  // 光的方向
  vec3 lightDirection=vec3(0.,0.,1.);// Light direction(World coordinate)
  //根据模型矩阵重新计算法线，使其长度为1。
  vec3 normal=normalize(vec3(u_NormalMatrix*a_Normal));
// 夹角  入射反方向和法线夹角  θ = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
  //   计算光线方向与表面方向(法线)的点积。
  v_NdotL=max(dot(normal,lightDirection),0.);
  // 贴图
  v_TexCoord=a_TexCoord;
}