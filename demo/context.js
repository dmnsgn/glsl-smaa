const createRegl = require("regl");

const regl = createRegl({
  pixelRatio: 1,
  extensions: [
    "WEBGL_depth_texture",
    "oes_texture_float",
    "oes_texture_float_linear",
    "OES_texture_half_float",
    "OES_texture_half_float_linear",
    "EXT_color_buffer_half_float",
    "WEBGL_color_buffer_float"
  ]
});

module.exports = regl;
