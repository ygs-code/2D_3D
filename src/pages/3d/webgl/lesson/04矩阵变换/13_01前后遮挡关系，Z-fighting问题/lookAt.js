/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */
var EPSILON = 0.000001;
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity$3(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

  /*

    eye=[xx,xx,xx]
    up=[xx,xx,xx]
    center=[xx,xx,xx]
    
    
    */

  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];

  var upx = up[0];
  var upy = up[1];
  var upz = up[2];

  // AT
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (
    Math.abs(eyex - centerx) < EPSILON &&
    Math.abs(eyey - centery) < EPSILON &&
    Math.abs(eyez - centerz) < EPSILON
  ) {
    return identity$3(out);
  }

  // N = eye–at  并归一化N。
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  /*
      u = up x n    up 叉乘 n  并归一化U。
    


    eye=[xx,xx,xx]
    up=[xx,xx,xx]
    center=[xx,xx,xx]
    // 向量现相减
    n=[
      eyex - centerx,
      eyey - centery,
      eyez - centerz
     ]=Z(x,y,z)

    up=[xx,xx,xx]
    Z=[xx,xx,xx]
    
 
    
    */

  /*
     up(y,z) 与 Z(y,z) 叉乘 
     x0 = |upy , upz|
          |z1  , z2 | 
    */
  x0 = upy * z2 - upz * z1;

  /*
    up(z,x) 与 Z(z,x) 叉乘 
    x1 = |upz, upx|
         |z2 ,  z0| 
    
    */
  x1 = upz * z0 - upx * z2;

  /*
    up(x,y) 与 Z(x,y) 叉乘 
    x2 = |upx, upy|
         |z0 ,  z1| 
    
    */
  x2 = upx * z1 - upy * z0;
  // Math.hypot()方法的功能就是先计算它的所有参数的平方和，再返回该和的平方根。
  // 就是求向量的模长
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  // V = N×U，并归一化V
  /*
      y0 = |z1 , z2| 
           |x1 , x2|
    */
  y0 = z1 * x2 - z2 * x1;
  /*
      y1 = |z2 , z0| 
           |x2 , x0|
    */
  y1 = z2 * x0 - z0 * x2;
  /*
      y1 = |z0 , z1| 
           |x0 , x1|
    */
  y2 = z0 * x1 - z1 * x0;

  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  /*
   eye 就是等于移动矩阵
   -eyey = [
     1,    0,   0,  0,
     0,    1,   0,  0,
     0,    0,   1,  0,
     -tx,-ty, -tz, 1,
   ]

  */

  let mat4_UVN = eval(
    ` [
      // u  v  n
        x0,y0,z0, 0,
        x1,y1,z1,0,
        x2,y2,z2,0,
        -(x0 * eyex + x1 * eyey + x2 * eyez),-(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyey + z2 * eyez),1
      ];    
    `
  );
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;

  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;

  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;

  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

export default lookAt;
