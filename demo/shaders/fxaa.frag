precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

varying vec2 vUv;

#pragma glslify: fxaa = require(glsl-fxaa)

void main () {
  vec2 fragCoord = vUv * resolution;

  gl_FragColor = fxaa(texture, fragCoord, resolution);
}
