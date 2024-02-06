

 attribute vec4 a_Position; // 物体顶点
 attribute vec4 a_Color; // 物体颜色
 attribute float a_Face;   //  表面数(不能使用int作为属性变量) Surface number (Cannot use int for attribute variable)
 uniform mat4 u_MvpMatrix; // mvp 矩阵
 uniform int u_PickedFace; // 所选面的面数 Surface number of selected face
 varying vec4 v_Color;  
 void main() {
  // 顶点
   gl_Position = u_MvpMatrix * a_Position;
   int face = int(a_Face); // Convert to int 转换为整型 强制转换
   /*
    a_Face ,  face 是顶点标志  1 - 6
   */ 
  //  vec3 color = (face == u_PickedFace) ? vec3(1.0) : a_Color.rgb;
   if(u_PickedFace == 0) { // 如果为0，则将面号插入alpha中  In case of 0, insert the face number into alpha
   /*
    a_Face 值为 1-6       因为在vertex设置1之后  gl.readPixels 获取到像素是 255。
    所以要转换成 1-6 要除以 255，这样 gl.readPixels 就可以获取到 1-6
   */  
     v_Color = vec4(a_Color.rgb, a_Face/255.0);
   } else {
     v_Color = vec4(a_Color.rgb, a_Color.a);
   }
 }