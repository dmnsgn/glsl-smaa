/**
 * Luma Edge Detection
 *
 * IMPORTANT NOTICE: luma edge detection requires gamma-corrected colors, and
 * thus 'uColorTexture' should be a non-sRGB texture.
 */

precision highp float;

#ifndef SMAA_THRESHOLD
  #define SMAA_THRESHOLD 0.1
#endif

#ifdef SMAA_EDGES_DEPTH
  #ifndef SMAA_DEPTH_THRESHOLD
    #define SMAA_DEPTH_THRESHOLD (0.1 * SMAA_THRESHOLD)
  #endif

  uniform sampler2D uDepthTexture;
#else
  #ifndef SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR
    #define SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR 2.0
  #endif

  uniform sampler2D uColorTexture;
#endif

varying vec2 vTexCoord0;
varying vec4 vOffset[3];

#ifdef SMAA_EDGES_DEPTH
// Depth
/**
 * Gathers current pixel, and the top-left neighbors.
 */
vec3 SMAAGatherNeighbours(vec2 texcoord, vec4 offset[3], sampler2D tex) {
  float P = texture2D(tex, texcoord).r;
  float Pleft = texture2D(tex, offset[0].xy).r;
  float Ptop  = texture2D(tex, offset[0].zw).r;

  return vec3(P, Pleft, Ptop);
}

vec2 SMAADepthEdgeDetection (vec2 texcoord, vec4 offset[3], sampler2D depthTex) {
  vec3 neighbours = SMAAGatherNeighbours(texcoord, offset, depthTex);
  vec2 delta = abs(neighbours.xx - vec2(neighbours.y, neighbours.z));
  vec2 edges = step(SMAA_DEPTH_THRESHOLD, delta);

  if (dot(edges, vec2(1.0, 1.0)) == 0.0)
      discard;

  return edges;
}
#endif

#ifdef SMAA_EDGES_COLOR
vec2 SMAAColorEdgeDetection(vec2 texcoord, vec4 offset[3], sampler2D colorTex) {
  // Calculate the threshold:
  vec2 threshold = vec2(SMAA_THRESHOLD);

  // Calculate color deltas:
  vec4 delta;
  vec3 c = texture2D(colorTex, texcoord).rgb;

  vec3 cLeft = texture2D(colorTex, offset[0].xy).rgb;
  vec3 t = abs(c - cLeft);
  delta.x = max(max(t.r, t.g), t.b);

  vec3 cTop  = texture2D(colorTex, offset[0].zw).rgb;
  t = abs(c - cTop);
  delta.y = max(max(t.r, t.g), t.b);

  // We do the usual threshold:
  vec2 edges = step(threshold, delta.xy);

  // Then discard if there is no edge:
  if (dot(edges, vec2(1.0, 1.0)) == 0.0)
      discard;

  // Calculate right and bottom deltas:
  vec3 cRight = texture2D(colorTex, offset[1].xy).rgb;
  t = abs(c - cRight);
  delta.z = max(max(t.r, t.g), t.b);

  vec3 cBottom  = texture2D(colorTex, offset[1].zw).rgb;
  t = abs(c - cBottom);
  delta.w = max(max(t.r, t.g), t.b);

  // Calculate the maximum delta in the direct neighborhood:
  vec2 maxDelta = max(delta.xy, delta.zw);

  // Calculate left-left and top-top deltas:
  vec3 cLeftLeft  = texture2D(colorTex, offset[2].xy).rgb;
  t = abs(c - cLeftLeft);
  delta.z = max(max(t.r, t.g), t.b);

  vec3 cTopTop = texture2D(colorTex, offset[2].zw).rgb;
  t = abs(c - cTopTop);
  delta.w = max(max(t.r, t.g), t.b);

  // Calculate the final maximum delta:
  maxDelta = max(maxDelta.xy, delta.zw);
  float finalDelta = max(maxDelta.x, maxDelta.y);

  // Local contrast adaptation:
  edges.xy *= step(finalDelta, SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR * delta.xy);

  return edges;
}
#endif

#ifdef SMAA_EDGES_LUMA

vec2 SMAALumaEdgeDetectionPS(vec2 texcoord, vec4 offset[3], sampler2D colorTex) {
  vec2 threshold = vec2(SMAA_THRESHOLD);

  // Calculate lumas:
  vec3 weights = vec3(0.2126, 0.7152, 0.0722);
  float L = dot(texture2D(colorTex, texcoord).rgb, weights);

  float Lleft = dot(texture2D(colorTex, offset[0].xy).rgb, weights);
  float Ltop  = dot(texture2D(colorTex, offset[0].zw).rgb, weights);

  // We do the usual threshold:
  vec4 delta;
  delta.xy = abs(L - vec2(Lleft, Ltop));
  vec2 edges = step(threshold, delta.xy);

  // Then discard if there is no edge:
  if (dot(edges, vec2(1.0, 1.0)) == 0.0)
      discard;

  // Calculate right and bottom deltas:
  float Lright = dot(texture2D(colorTex, offset[1].xy).rgb, weights);
  float Lbottom  = dot(texture2D(colorTex, offset[1].zw).rgb, weights);
  delta.zw = abs(L - vec2(Lright, Lbottom));

  // Calculate the maximum delta in the direct neighborhood:
  vec2 maxDelta = max(delta.xy, delta.zw);

  // Calculate left-left and top-top deltas:
  float Lleftleft = dot(texture2D(colorTex, offset[2].xy).rgb, weights);
  float Ltoptop = dot(texture2D(colorTex, offset[2].zw).rgb, weights);
  delta.zw = abs(vec2(Lleft, Ltop) - vec2(Lleftleft, Ltoptop));

  // Calculate the final maximum delta:
  maxDelta = max(maxDelta.xy, delta.zw);
  float finalDelta = max(maxDelta.x, maxDelta.y);

  // Local contrast adaptation:
  edges.xy *= step(finalDelta, SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR * delta.xy);

  return edges;
}
#endif

void main() {
  vec4 color;

  #ifdef SMAA_EDGES_DEPTH
    color.xy = SMAADepthEdgeDetection(vTexCoord0, vOffset, uDepthTexture);
  #elif defined(SMAA_EDGES_COLOR)
    color.xy = SMAAColorEdgeDetection(vTexCoord0, vOffset, uColorTexture);
  #elif defined(SMAA_EDGES_LUMA)
    color.xy = SMAALumaEdgeDetectionPS(vTexCoord0, vOffset, uColorTexture);
  #endif

  gl_FragColor = color;
}
