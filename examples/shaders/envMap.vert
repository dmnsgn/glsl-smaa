precision mediump float;

attribute vec2 aPosition;

uniform mat4 uCameraView;

varying vec3 vReflectDir;

void main() {
  vReflectDir = (uCameraView * vec4(aPosition, 1, 0)).xyz;

  gl_Position = vec4(aPosition, 0.0, 1.0);
}
