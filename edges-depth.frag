precision highp float;

#ifndef SMAA_THRESHOLD
#define SMAA_THRESHOLD 0.1
#endif

#ifndef SMAA_DEPTH_THRESHOLD
#define SMAA_DEPTH_THRESHOLD (0.1 * SMAA_THRESHOLD)
#endif

uniform sampler2D depthTex;

varying vec2 vTexCoord0;
varying vec4 vOffset[3];

/**
 * Gathers current pixel, and the top-left neighbors.
 */
vec3 SMAAGatherNeighbours(vec2 texcoord, vec4 offset[3], sampler2D tex) {
  float P = texture2D(tex, texcoord).r;
  float Pleft = texture2D(tex, offset[0].xy).r;
  float Ptop  = texture2D(tex, offset[0].zw).r;

  return vec3(P, Pleft, Ptop);
}

void main () {
  vec3 neighbours = SMAAGatherNeighbours(vTexCoord0, vOffset, depthTex);
  vec2 delta = abs(neighbours.xx - vec2(neighbours.y, neighbours.z));
  vec2 edges = step(SMAA_DEPTH_THRESHOLD, delta);

  if (dot(edges, vec2(1.0, 1.0)) == 0.0)
      discard;

  gl_FragColor = vec4(edges, 0.0, 1.0);
}
