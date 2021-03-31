import regl from "./context.js";

// Options
const textureOptions = {
  width: 1,
  height: 1,
};
const SMAATextureOptions = {
  wrap: "clamp",
  min: "linear",
  mag: "linear",
  format: "rgba",
  type: "float",
};

// Color/depth FBOs
const background = regl.framebuffer({
  color: regl.texture({ ...textureOptions }),
  depth: true,
});
const color = regl.framebuffer({
  color: regl.texture({ ...textureOptions }),
  depthStencil: regl.texture({
    ...textureOptions,
    format: "depth stencil",
    type: "depth stencil",
  }),
});
const depth = regl.framebuffer({
  color: regl.texture({ ...textureOptions }),
  depth: true,
});

// Post-pro
const FXAA = regl.framebuffer({
  color: regl.texture({ ...textureOptions }),
  depth: false,
});

const SMAA = regl.framebuffer({
  color: regl.texture({
    ...textureOptions,
    ...SMAATextureOptions,
  }),
  depth: false,
});
const edges = regl.framebuffer({
  color: regl.texture({
    ...textureOptions,
    ...SMAATextureOptions,
    format: "rgb",
  }),
  depth: false,
});
const weights = regl.framebuffer({
  color: regl.texture({
    ...textureOptions,
    ...SMAATextureOptions,
  }),
  depth: false,
});

export default {
  background,
  color,
  depth,
  FXAA,
  SMAA,
  edges,
  weights,
};
