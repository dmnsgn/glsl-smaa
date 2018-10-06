const glsl = require("glslify");

// Shaders
const COPY_VERT = glsl("./shaders/copy.vert");
const COPY_FRAG = glsl("./shaders/copy.frag");
const DEPTH_FRAG = glsl("./shaders/depth.frag");

const ENVMAP_VERT = glsl("./shaders/envMap.vert");
const ENVMAP_FRAG = glsl("./shaders/envMap.frag");
const MATERIAL_VERT = glsl("./shaders/material.vert");
const MATERIAL_FRAG = glsl("./shaders/material.frag");

const LAYER_FRAG = glsl("./shaders/layer.frag");
const FXAA_FRAG = glsl("./shaders/fxaa.frag");

// Lib
const EDGES_VERT = glsl("../edges.vert");
const LUMA_EDGES_FRAG = glsl("../edges-luma.frag");
const COLOR_EDGES_FRAG = glsl("../edges-color.frag");
const DEPTH_EDGES_FRAG = glsl("../edges-depth.frag");

const SMAA_WEIGHTS_VERT = glsl("../smaa-weights.vert");
const SMAA_WEIGHTS_FRAG = glsl("../smaa-weights.frag");

const SMAA_BLEND_VERT = glsl("../smaa-blend.vert");
const SMAA_BLEND_FRAG = glsl("../smaa-blend.frag");

module.exports = {
  COPY_VERT,
  COPY_FRAG,
  DEPTH_FRAG,
  ENVMAP_VERT,
  ENVMAP_FRAG,
  MATERIAL_VERT,
  MATERIAL_FRAG,
  LAYER_FRAG,
  FXAA_FRAG,
  EDGES_VERT,
  LUMA_EDGES_FRAG,
  COLOR_EDGES_FRAG,
  DEPTH_EDGES_FRAG,
  SMAA_WEIGHTS_VERT,
  SMAA_WEIGHTS_FRAG,
  SMAA_BLEND_VERT,
  SMAA_BLEND_FRAG
};
