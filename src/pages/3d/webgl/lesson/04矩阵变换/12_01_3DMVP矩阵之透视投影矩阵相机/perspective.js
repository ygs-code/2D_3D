/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
export default function perspective(out, fovy, aspect, near, far) {
  /*
  
  描述
    tan 方法返回一个数值，表示一个角的正切值。

    由于 tan 是 Math 的静态方法，所以应该像这样使用 Math.tan()，而不是作为你创建的 Math 实例的方法。
    由于 Math.tan() 函数接受弧度数值，但是通常使用度更方便，下面的函数可以接受以度为单位的数值，将其转为弧度，然后返回其正切值。
    function getTanDeg(deg) {
        var rad = (deg * Math.PI) / 180;
        return Math.tan(rad);
    }

  
    */

  var f = 1.0 / Math.tan(fovy / 2),
    nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;

  out[8] = 0;
  out[9] = 0;
  out[11] = -1;

  out[12] = 0;

  out[13] = 0;
  out[15] = 0;

  let mat4 = eval(`
      [
        f/aspect, 0,   0,                  0,
        0,        f,   0,                  0,
        0,        0,  (far + near) * nf ,  -1, 
        0,        0,  2 * far * near * nf,  0 
      ]
    `);

  if (far !== null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
