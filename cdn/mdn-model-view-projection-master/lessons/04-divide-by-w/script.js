/*
  An easy way to start getting some perspective on our model of the cube is to
  take the Z coordinate and copy it over to the W coordinate.
  Normally when converting a cartesian point to homogeneous it becomes (x,y,z,1),
  but we're going to set it to something like (x,y,z,z). In reality we want to
  make sure that z is greater than 0 for points in view, so we'll modify it slightly
  by changing the value to (1.0 + (z * scaleFactor)). This will take a point that
  is normally in clip space (-1 to 1) and move it into a space more like (0 to 2).
  The scale factor changes final w value to be either higher or lower overall.

  If that sounds a little abstract open up the vertex shader and play around with
  the scale factor and watch how it shrinks points more towards the surface. Completely
  change the w component values for really trippy representations of space.

  In the next lesson we'll take this step of copying Z into the W slot and turn
  it into a matrix.

  Exercise:

    Modify the scaleFactor in the vertex shader in index.html and observe the changes.
    Move the cube around by changing the model matrix.


      开始获得多维数据集模型的透视图的一个简单方法是
      把Z坐标复制到W坐标上。
      通常，当将笛卡尔点转换为齐次点时，它变成(x,y,z,1)，
      但我们要把它设为(x,y,z,z)之类的。在现实中，我们想要
      确保z对于视点大于0，所以我们稍微修改一下
      通过将值更改为(1.0 + (z * scaleFactor))。这需要一个点
      通常在剪辑空间(-1到1)中，并将其移动到更像(0到2)的空间中。
      比例因子将最终w值更改为更高或更低。
      如果这听起来有点抽象，打开顶点着色器并进行操作
      比例因子和观察它是如何收缩的更趋向于表面。完全
      改变w分量的值来表示空间。
      在下一课中，我们将采取这个步骤，将Z复制到W槽中并转向
      它变成一个矩阵。
      练习:
      在index.html中修改顶点着色器中的scaleFactor并观察变化。
      通过更改模型矩阵来移动立方体。

*/

function CubeDemo () {
  
  // Prep the canvas
  this.canvas = document.getElementById("canvas");
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  
  // Grab a context
  this.gl = MDN.createContext(this.canvas);

  this.transforms = {}; // All of the matrix transforms
  this.locations = {}; //All of the shader locations
  
  // Get the rest going
  this.buffers = MDN.createBuffersForCube(this.gl, MDN.createCubeData() );
  this.webglProgram = this.setupProgram();
  
}

CubeDemo.prototype.setupProgram = function() {
  
  var gl = this.gl;
    
  // Setup a WebGL program
  var webglProgram = MDN.createWebGLProgramFromIds(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(webglProgram);
  
  // Save the attribute and uniform locations
  this.locations.model = gl.getUniformLocation(webglProgram, "model");
  this.locations.position = gl.getAttribLocation(webglProgram, "position");
  this.locations.color = gl.getAttribLocation(webglProgram, "color");
  
  // Tell WebGL to test the depth when drawing
  gl.enable(gl.DEPTH_TEST);
  
  return webglProgram;
};

CubeDemo.prototype.computeModelMatrix = function( now ) {

  //Scale down by 20% 缩小
  var scale = MDN.scaleMatrix(0.2, 0.2, 0.2);
  
  // Rotate a slight tilt 旋转 x
  var rotateX = MDN.rotateXMatrix( now * 0.0003 );
  
  // Rotate according to time 旋转 y
  var rotateY = MDN.rotateYMatrix( now * 0.0005 );

  // Move slightly down  // 平移     x   y    z
  var position = MDN.translateMatrix(0, -0.1, 0);
  
  // Multiply together, make sure and read them in opposite order
  this.transforms.model = MDN.multiplyArrayOfMatrices([
    position, // step 4
    rotateY,  // step 3
    rotateX,  // step 2
    scale     // step 1
  ]);
  
  
  // Performance caveat: in real production code it's best not to create
  // new arrays and objects in a loop. This example chooses code clarity
  // over performance.
};

CubeDemo.prototype.draw = function() {
  
  var gl = this.gl;
  var now = Date.now();
  
  // Compute our matrices
  this.computeModelMatrix( now );
  
  // Update the data going to the GPU
  this.updateAttributesAndUniforms();
  
  // Perform the actual draw
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  
  // Run the draw as a loop
  requestAnimationFrame( this.draw.bind(this) );
};

CubeDemo.prototype.updateAttributesAndUniforms = function() {

  var gl = this.gl;
  
  // Setup the color uniform that will be shared across all triangles
  gl.uniformMatrix4fv(this.locations.model, false, new Float32Array(this.transforms.model));
  
  // Set the positions attribute
  gl.enableVertexAttribArray(this.locations.position);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
  gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute
  gl.enableVertexAttribArray(this.locations.color);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
  gl.vertexAttribPointer(this.locations.color, 4, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.elements );
  
};

var cube = new CubeDemo();

cube.draw();