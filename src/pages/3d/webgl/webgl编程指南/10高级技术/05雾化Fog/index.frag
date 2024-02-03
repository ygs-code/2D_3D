
#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 u_FogColor;// 雾化颜色
uniform vec2 u_FogDist;// 雾距(起点、终点) Distance of Fog (starting point, end point)
varying vec4 v_Color;   // 物体颜色
varying float v_Dist;  // 眼镜 视点 到物体顶点位置的距离  离散
void main(){
  // Calculation of fog factor (factor becomes smaller as it goes further away from eye point) 
 // 雾系数计算(离视点越远，雾系数越小)
 /*
 Clamp函数可以将随机变化的数值限制在一个给定的区间[min, max]内
 template<class T>
T Clamp(T x, T min, T max)
{
    if (x > max)
        return max;
    if (x < min)
        return min;
    return x;
}
  限制    (u_FogDist.y-v_Dist)/(u_FogDist.y-u_FogDist.x) 在 0 - 1 之间 
  u_FogDist.y 雾化终点
  u_FogDist.x 雾化起点

   u_FogDist.y-v_Dist = 雾化终点 -  眼镜 视点 到物体顶点位置的距离  离散
  (u_FogDist.y-u_FogDist.x) = 雾化终点 -  雾化起点

 */
  float fogFactor=clamp((u_FogDist.y-v_Dist)/(u_FogDist.y-u_FogDist.x), 0. ,1.);
  // Stronger fog as it gets further: u_FogColor * (1 - fogFactor) + v_Color * fogFactor
  // 更强的雾，因为它得到进一步:u_FogColor * (1 - fogFactor) + v_Color * fogFactor
  /*
     取最小值   
  */
  vec3 color= mix( u_FogColor,  vec3(v_Color), fogFactor);
  gl_FragColor=vec4(color,v_Color.a);
}