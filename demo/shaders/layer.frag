precision mediump float;

uniform sampler2D background;
uniform sampler2D foreground;

varying vec2 vUv;

void main () {
  vec4 bg = texture2D(background, vUv);
  vec4 fg = texture2D(foreground, vUv);

  gl_FragColor = fg * fg.a + bg * (1.0 - fg.a);
}
