precision mediump float;

uniform sampler2D uEnvMap;

varying vec3 vReflectDir;

#define PI 3.14159265359

vec4 lookupEnv (vec3 dir) {
  float lat = atan(dir.z, dir.x);
  float lon = acos(dir.y / length(dir));

  return texture2D(uEnvMap, vec2(0.5 + lat / (2.0 * PI), lon / PI));
}

void main () {
  gl_FragColor = lookupEnv(vReflectDir);
}
