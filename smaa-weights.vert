#define mad(a, b, c) (a * b + c)

#if defined(SMAA_PRESET_LOW)
#define SMAA_MAX_SEARCH_STEPS 4
#elif defined(SMAA_PRESET_MEDIUM)
#define SMAA_MAX_SEARCH_STEPS 8
#elif defined(SMAA_PRESET_HIGH)
#define SMAA_MAX_SEARCH_STEPS 16
#elif defined(SMAA_PRESET_ULTRA)
#define SMAA_MAX_SEARCH_STEPS 32
#endif

#ifndef SMAA_MAX_SEARCH_STEPS
#define SMAA_MAX_SEARCH_STEPS 16
#endif

attribute vec2 aPosition;

uniform vec2 resolution;

varying vec2 vTexCoord0;
varying vec2 vPixCoord;
varying vec4 vOffset[3];

void main() {
  vec4 SMAA_RT_METRICS = vec4(1.0 / resolution.x, 1.0 / resolution.y, resolution.x, resolution.y);

	vTexCoord0 = vec2((aPosition + 1.0) / 2.0);

  vPixCoord = vTexCoord0 * SMAA_RT_METRICS.zw;

  // We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
  vOffset[0] = mad(SMAA_RT_METRICS.xyxy, vec4(-0.25, -0.125,  1.25, -0.125), vTexCoord0.xyxy);
  vOffset[1] = mad(SMAA_RT_METRICS.xyxy, vec4(-0.125, -0.25, -0.125,  1.25), vTexCoord0.xyxy);

  // And these for the searches, they indicate the ends of the loops:
  vOffset[2] = mad(
    SMAA_RT_METRICS.xxyy,
    vec4(-2.0, 2.0, -2.0, 2.0) * float(SMAA_MAX_SEARCH_STEPS),
    vec4(vOffset[0].xz, vOffset[1].yw)
  );

  gl_Position = vec4(aPosition, 0.0, 1.0);
}
