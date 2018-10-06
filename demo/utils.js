const AsyncPreloader = require("async-preloader").default;
const parseHdr = require("parse-hdr");

const regl = require("./context.js");

async function loadTexture(src, options = {}) {
  const image = await AsyncPreloader.loadImage({ src });
  const bitmap = await createImageBitmap(image);

  const texture = regl.texture({ data: bitmap, ...options });
  texture.resize(image.width, image.height);

  return texture;
}

async function loadHdrTexture(src, options) {
  const buffer = await AsyncPreloader.loadArrayBuffer({ src });
  const image = parseHdr(buffer);

  const texture = regl.texture(image);
  if (options) texture({ ...options });
  texture.resize(image.shape[0], image.shape[1]);

  return texture;
}

module.exports = {
  loadTexture,
  loadHdrTexture
};
