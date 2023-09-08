attribute vec4 aPosition;
attribute float aTranslate;
void main() {
    gl_Position = vec4(aPosition.x * aTranslate, aPosition.y * aTranslate, aPosition.z, 1.0);
    gl_PointSize = 10.0;
}