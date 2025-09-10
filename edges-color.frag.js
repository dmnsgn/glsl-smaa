export default /* glsl */ `/**
 * Color Edge Detection
 *
 * IMPORTANT NOTICE: color edge detection requires gamma-corrected colors, and
 * thus 'uTexture' should be a non-sRGB texture.
 */

precision highp float;

#ifndef SMAA_THRESHOLD
#define SMAA_THRESHOLD 0.1
#endif

#ifndef SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR
#define SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR 2.0
#endif

uniform sampler2D uTexture;

varying vec2 vTexCoord0;
varying vec4 vOffset[3];

void main() {
  // Calculate the threshold:
  vec2 threshold = vec2(SMAA_THRESHOLD);

  // Calculate color deltas:
  vec4 delta;
  vec3 c = texture2D(uTexture, vTexCoord0).rgb;

  vec3 cLeft = texture2D(uTexture, vOffset[0].xy).rgb;
  vec3 t = abs(c - cLeft);
  delta.x = max(max(t.r, t.g), t.b);

  vec3 cTop  = texture2D(uTexture, vOffset[0].zw).rgb;
  t = abs(c - cTop);
  delta.y = max(max(t.r, t.g), t.b);

  // We do the usual threshold:
  vec2 edges = step(threshold, delta.xy);

  // Then discard if there is no edge:
  if (dot(edges, vec2(1.0, 1.0)) == 0.0)
      discard;

  // Calculate right and bottom deltas:
  vec3 cRight = texture2D(uTexture, vOffset[1].xy).rgb;
  t = abs(c - cRight);
  delta.z = max(max(t.r, t.g), t.b);

  vec3 cBottom  = texture2D(uTexture, vOffset[1].zw).rgb;
  t = abs(c - cBottom);
  delta.w = max(max(t.r, t.g), t.b);

  // Calculate the maximum delta in the direct neighborhood:
  vec2 maxDelta = max(delta.xy, delta.zw);

  // Calculate left-left and top-top deltas:
  vec3 cLeftLeft  = texture2D(uTexture, vOffset[2].xy).rgb;
  t = abs(c - cLeftLeft);
  delta.z = max(max(t.r, t.g), t.b);

  vec3 cTopTop = texture2D(uTexture, vOffset[2].zw).rgb;
  t = abs(c - cTopTop);
  delta.w = max(max(t.r, t.g), t.b);

  // Calculate the final maximum delta:
  maxDelta = max(maxDelta.xy, delta.zw);
  float finalDelta = max(maxDelta.x, maxDelta.y);

  // Local contrast adaptation:
  edges.xy *= step(finalDelta, SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR * delta.xy);

  gl_FragColor = vec4(edges, 0.0, 1.0);
}
`;
