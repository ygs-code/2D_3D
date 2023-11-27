attribute vec3 a_Position;
attribute vec4 a_Colors;
uniform mat4 u_RotationMatrix;// 旋转矩阵
uniform mat4 u_TranslatrMatrix;// 平移矩阵
uniform mat4 u_ScaleMatrix;// 缩放矩阵

varying vec4 v_Color;
// mat4 rotationMatrix = mat4(
  //     1.0, 0.0, 0.0, 0.0,
  //     0.0, 1.0, 0.0, 0.0,
  //     0.0, 0.0, 1.0, 0.0,
  //     0.0, 0.0, 0.0, 1.0
// );
void main(){

  // modelMatrix = 平移 * 旋转 * 缩放 * 顶点
  // 3DPoint * M缩放 * M旋转 * M平移 * V * P//这个是实际操作顺序
 
  // P * V * M平移 * M旋转 * M缩放 * 3DPoint//才能得到正确结果

     // 平移 * 旋转 * 缩放 * 顶点
  /*
  拆开可以理解 三步：
  1.  [平移缩放后的矩阵] =  [平移矩阵] * [缩放矩阵]
  2.  [平移缩放旋转后的矩阵]=  [平移缩放后的矩阵]*[旋转矩阵]
  3. [模型矩阵] = [平移缩放旋转后的矩阵] * [原始坐标]


模型矩阵可以把模型的局部坐标变换为世界坐标。
需要对模型进行缩放、绕xyz轴旋转、平移（注意：三个操作的先后顺序不能变） 。

  */
  mat4 modeleMatrix=u_TranslatrMatrix*u_RotationMatrix*u_ScaleMatrix;
  v_Color=a_Colors;
  gl_Position=modeleMatrix*vec4(a_Position,1.);
  gl_PointSize=10.;
}