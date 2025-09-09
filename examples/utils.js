import AsyncPreloader from "async-preloader";
import parseHdr from "parse-hdr";

import regl from "./context.js";

async function loadTexture(src, options = {}) {
  const image = await AsyncPreloader.loadImage({ src });
  const texture = regl.texture({ data: image, ...options });
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

export { loadTexture, loadHdrTexture };
