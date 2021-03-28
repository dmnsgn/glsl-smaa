const createCube = require("primitive-cube");
const createSphere = require("primitive-sphere");
const computeNormals = require("geom-normals");
const bunnyGeometry = require("bunny");

const regl = require("./context.js");

const FBO = require("./fbos.js");

const {
  COPY_VERT,
  COPY_FRAG,
  DEPTH_FRAG,
  ENVMAP_VERT,
  ENVMAP_FRAG,
  MATERIAL_VERT,
  MATERIAL_FRAG,
  LAYER_FRAG,
  FXAA_FRAG,
  PRESETS,
  EDGES_VERT,
  LUMA_EDGES_FRAG,
  COLOR_EDGES_FRAG,
  DEPTH_EDGES_FRAG,
  SMAA_WEIGHTS_VERT,
  SMAA_WEIGHTS_FRAG,
  SMAA_BLEND_VERT,
  SMAA_BLEND_FRAG
} = require("./shaders");

// Env map
const envMap = regl({
  vert: ENVMAP_VERT,
  frag: ENVMAP_FRAG,
  uniforms: {
    uCameraView: regl.prop("uCameraView"),
    uEnvMap: regl.prop("uEnvMap")
  },
  attributes: {
    aPosition: [-4, -4, -4, 4, 8, 0]
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

// Meshes
const cubeGeometry = createCube(1, 1, 1, 100, 100, 100);
const sphereGeometry = createSphere(1, { segments: 16 });

const cube = regl({
  vert: `#define UVS
  ${MATERIAL_VERT}
  `,
  frag: `#define UVS
  ${MATERIAL_FRAG}
  `,
  attributes: {
    aPosition: cubeGeometry.positions,
    aNormal: cubeGeometry.normals,
    aUv: cubeGeometry.uvs
  },
  uniforms: {
    uModelMatrix: regl.prop("uModelMatrix"),
    uModelViewMatrix: regl.prop("uModelViewMatrix"),
    uProjectionMatrix: regl.prop("uProjectionMatrix"),
    uCameraPosition: regl.prop("uCameraPosition"),
    uNormalMatrix: regl.prop("uNormalMatrix"),
    uDiffuseColor: regl.prop("uDiffuseColor"),
    uColorMap: regl.prop("uColorMap"),
    uEnvMap: regl.prop("uEnvMap")
  },
  elements: cubeGeometry.cells
});
const sphere = regl({
  vert: `#define UVS
  ${MATERIAL_VERT}
  `,
  frag: `#define UVS
  ${MATERIAL_FRAG}
  `,
  attributes: {
    aPosition: sphereGeometry.positions,
    aNormal: sphereGeometry.normals,
    aUv: sphereGeometry.uvs
  },
  uniforms: {
    uModelMatrix: regl.prop("uModelMatrix"),
    uModelViewMatrix: regl.prop("uModelViewMatrix"),
    uProjectionMatrix: regl.prop("uProjectionMatrix"),
    uCameraPosition: regl.prop("uCameraPosition"),
    uNormalMatrix: regl.prop("uNormalMatrix"),
    uDiffuseColor: regl.prop("uDiffuseColor"),
    uColorMap: regl.prop("uColorMap"),
    uEnvMap: regl.prop("uEnvMap")
  },
  elements: sphereGeometry.cells
});
const bunny = regl({
  vert: MATERIAL_VERT,
  frag: MATERIAL_FRAG,
  attributes: {
    aPosition: bunnyGeometry.positions,
    aNormal: computeNormals(bunnyGeometry.positions, bunnyGeometry.cells)
  },
  uniforms: {
    uModelMatrix: regl.prop("uModelMatrix"),
    uModelViewMatrix: regl.prop("uModelViewMatrix"),
    uProjectionMatrix: regl.prop("uProjectionMatrix"),
    uCameraPosition: regl.prop("uCameraPosition"),
    uNormalMatrix: regl.prop("uNormalMatrix"),
    uDiffuseColor: regl.prop("uDiffuseColor"),
    uColorMap: regl.prop("uColorMap"),
    uEnvMap: regl.prop("uEnvMap")
  },
  elements: bunnyGeometry.cells
});

const PRESET = `#define SMAA_PRESET_ULTRA`;

// SMAA
const SMAADepthEdges = regl({
  vert: `${PRESET}
  ${PRESETS}
  ${EDGES_VERT}`,
  frag: `${PRESET}
  ${PRESETS}
  ${DEPTH_EDGES_FRAG}`,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    depthTex: FBO.depth
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});
const SMAALumaEdges = regl({
  vert: `${PRESET}
  ${PRESETS}
  ${EDGES_VERT}`,
  frag: `${PRESET}
  ${PRESETS}
  ${LUMA_EDGES_FRAG}`,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    colorTex: FBO.SMAA
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});
const SMAAColorEdges = regl({
  vert: `${PRESET}
  ${PRESETS}
  ${EDGES_VERT}`,
  frag: `${PRESET}
  ${PRESETS}
  // #define SMAA_THRESHOLD 0.1
  // #define SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR 2.0
  ${COLOR_EDGES_FRAG}
  `,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    colorTex: FBO.SMAA
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

const SMAAWeights = regl({
  vert: `${PRESET}
  ${PRESETS}
  ${SMAA_WEIGHTS_VERT}
  `,
  frag: `${PRESET}
  ${PRESETS}
  ${SMAA_WEIGHTS_FRAG}
  `,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    edgesTex: FBO.edges,
    searchTex: regl.prop("searchTex"),
    areaTex: regl.prop("areaTex")
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

const SMAABlend = regl({
  vert: `${PRESET}
  ${PRESETS}
  ${SMAA_BLEND_VERT}`,
  frag: `${PRESET}
  ${PRESETS}
  ${SMAA_BLEND_FRAG}`,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    colorTex: FBO.SMAA,
    blendTex: FBO.weights
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

// FXAA
const FXAA = regl({
  vert: COPY_VERT,
  frag: FXAA_FRAG,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    texture: FBO.color
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

// SCREEN
const layers = regl({
  vert: COPY_VERT,
  frag: LAYER_FRAG,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    background: regl.prop("background"),
    foreground: regl.prop("foreground")
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

const toTexture = regl({
  vert: COPY_VERT,
  frag: COPY_FRAG,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
    texture: regl.prop("texture")
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

const depth = regl({
  vert: COPY_VERT,
  frag: DEPTH_FRAG,
  attributes: {
    aPosition: [-4, -4, 4, -4, 0, 4]
  },
  uniforms: {
    near: regl.prop("near"),
    far: regl.prop("far"),
    depthTexture: regl.prop("depthTexture")
  },
  depth: {
    enable: false,
    mask: false
  },
  count: 3
});

const clear = alpha =>
  regl.clear({
    color: [0.0, 0.0, 0.0, alpha ? 0.0 : 1.0],
    depth: 1,
    stencil: 0
  });

module.exports = {
  envMap,
  cube,
  sphere,
  bunny,
  SMAADepthEdges,
  SMAALumaEdges,
  SMAAColorEdges,
  SMAAWeights,
  SMAABlend,
  FXAA,
  layers,
  toTexture,
  depth,
  clear
};
