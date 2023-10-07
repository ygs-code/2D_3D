# GLSI 语言

   区分大小写，以分号结尾；

  注释和JavaScript一样，一行是 //  多行是 /* */

   数据类型，(简单的数字类型)

   数字类型(int , float)， 布尔类型。

  类似c语言 整型 int  n=1

  浮点型 float n = 1.0  

 布尔类型 bool true，false

 变量声明 不能以gl_ 这个开头，因为这个是系统关键名称。

向量声明 vec3 color;

类型转换  int  float bool

整型转换成浮点型  float(int) 强制类型转换。

计算  + - * / 

 ++ -- +=  -+  *=  都是一样

向量 vector vec2  vec3 vec4 



// 三维向量

vec3 color = vec3(1.0,  0.5, 0.7);

他可以这样取值 color.x  , color.y ,  color.z



// 四维向量

vec4 color = vec4(1.0,  0.5, 0.7, 1.0);

他可以这样取值 color.x  , color.y ,  color.z , color.w ,

也可以这样取值 color.r  , color.g ,  color.b, color.a,

也可以这样取值 color.s  , color.t ,  color.p, color.q,