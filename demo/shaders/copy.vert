precision mediump float;

attribute vec2 aPosition;

varying vec2 vUv;

void main () {
  vUv = 0.5 * (aPosition + 1.0);

  gl_Position = vec4(aPosition, 0.0, 1.0);
}
