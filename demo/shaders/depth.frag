precision mediump float;

uniform sampler2D depthTexture;

uniform float near;
uniform float far;

varying vec2 vUv;

float LinearizeDepth(float depth) {
  float z = depth * 2.0 - 1.0;

  return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
  float depth = LinearizeDepth(texture2D(depthTexture, vUv).x);

  gl_FragColor.rgb = 1.0 - vec3(depth);
  gl_FragColor.a = 1.0;
}
