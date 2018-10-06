precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

#ifdef UVS
attribute vec2 aUv;
varying vec2 vUv;
#endif

uniform mat4 uProjectionMatrix;

uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vViewPosition;
varying vec4 vWorldPosition;
varying vec3 vNormal;

void main () {
  vNormal = uNormalMatrix * aNormal;

  #ifdef UVS
  vUv = aUv;
  #endif

  vec4 modelViewPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  vViewPosition = -modelViewPosition.xyz;
  vWorldPosition = uModelMatrix * vec4(aPosition, 1.0);

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
