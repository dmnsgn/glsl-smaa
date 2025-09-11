# glsl-smaa

[![npm version](https://img.shields.io/npm/v/glsl-smaa)](https://www.npmjs.com/package/glsl-smaa)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/glsl-smaa)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/glsl-smaa)](https://www.npmjs.com/package/glsl-smaa)
[![dependencies](https://img.shields.io/david/dmnsgn/glsl-smaa)](https://github.com/dmnsgn/glsl-smaa/blob/main/package.json)
[![types](https://img.shields.io/npm/types/glsl-smaa)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/glsl-smaa)](https://github.com/dmnsgn/glsl-smaa/blob/main/LICENSE.md)

SMAA (Enhanced Subpixel Morphological Antialiasing) post-processing; WebGL (OpenGL ES 2.0) implementation with no fluff. All credit goes to the incredible work [here (iryoku)](http://www.iryoku.com/smaa/) and [there (beakbeak)](https://github.com/beakbeak/smaa-webgl).

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

## Installation

```bash
npm install glsl-smaa
```

## Usage

Three passes are required to apply the effect:

```
             |input|------------------·
                v                     |
      [ SMAA*EdgeDetection ]          |
                v                     |
            |edgesTex|                |
                v                     |
[ SMAABlendingWeightCalculation ]     |
                v                     |
            |blendTex|                |
                v                     |
  [ SMAANeighborhoodBlending ] <------·
                v
             |output|
```

You would typically set this up as part of a post-processing chain with FBOs.

See the [examples](https://dmnsgn.github.io/glsl-smaa/) and its [source](examples/index.js) for an example with [REGL](http://regl.party/).

## Attributes

Attributes required for all vertex shaders:

| Name          | Type | Description      |
| ------------- | ---- | ---------------- |
| **aPosition** | vec2 | Screen vertices. |

## Uniforms and defines

Uniforms required for all shaders:

| Name           | Type | Description           |
| -------------- | ---- | --------------------- |
| **resolution** | vec2 | The framebuffer size. |

`#define` can be preprended to the shaders to overwrite default settings. Typically:

```js
const frag = `#define SMAA_PRESET_HIGH
${PRESETS}
${SMAA_WEIGHTS_FRAG}
`;
```

### `smaa-edges.vert`

No options.

### `smaa-edges.frag`

You can use one of the 3 following edge detection method:

- Depth: the fastest but it may miss some edges.

- Luma: more expensive than depth edge detection, but catches visible edges that depth edge detection can miss.

- Color: the most expensive one but catches chroma-only edges.

![](https://raw.githubusercontent.com/dmnsgn/glsl-smaa/main/examples/preview-edges.gif)

Defines:

```glsl
# One of:
#define SMAA_EDGES_DEPTH
#define SMAA_EDGES_LUMA
#define SMAA_EDGES_COLOR

#define SMAA_THRESHOLD 0.1
#define SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR 2.0
#define SMAA_PREDICATION 0
```

| Name                                      | Default [Range] | Description                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SMAA_THRESHOLD**                        | 0.1 [0, 0.5]    | Specifies the threshold or sensitivity to edges. Lowering this value you will be able to detect more edges at the expense of performance. Range: [0, 0.5]. 0.1 is a reasonable value, and allows to catch most visible edges. 0.05 is a rather overkill value, that allows to catch 'em all.                                          |
| **SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR** | 2.0             | If there is an neighbor edge that has SMAA_LOCAL_CONTRAST_FACTOR times bigger contrast than current edge, current edge will be discarded. This allows to eliminate spurious crossing edges, and is based on the fact that, if there is too much contrast in a direction, that will hide perceptually contrast in the other neighbors. |
| **SMAA_PREDICATION**                      | 0               | It locally decreases the luma or color threshold if an edge is found in depth buffer (so the global threshold can be higher).                                                                                                                                                                                                         |

Uniforms:

#### `luma-edges.frag`

| Name              | Type      | Description                  |
| ----------------- | --------- | ---------------------------- |
| **uColorTexture** | sampler2D | The input color framebuffer. |

#### `color-edges.frag`

| Name              | Type      | Description                  |
| ----------------- | --------- | ---------------------------- |
| **uColorTexture** | sampler2D | The input color framebuffer. |

#### `depth-edges.frag`

| Name              | Type      | Description                  |
| ----------------- | --------- | ---------------------------- |
| **uDepthTexture** | sampler2D | The input depth framebuffer. |

---

### `smaa-weights.(vert|frag)`

Defines from `presets.glsl`:

```glsl
# Use presets:
#define SMAA_PRESET_LOW
#define SMAA_PRESET_MEDIUM
#define SMAA_PRESET_HIGH
#define SMAA_PRESET_ULTRA

# or individually setting:
#define SMAA_THRESHOLD 0.1
#define SMAA_MAX_SEARCH_STEPS 16
#define SMAA_MAX_SEARCH_STEPS_DIAG 8
#define SMAA_CORNER_ROUNDING 25

# and optionally disable diagonal and corner detection:
#define SMAA_DISABLE_DIAG_DETECTION
#define SMAA_DISABLE_CORNER_DETECTION
```

| Name                           | Default [Range] | Description                                                                                                                                                                                                                                                                                                              |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SMAA_THRESHOLD**             | 0.1 [0, 0.5]    | Should the same as for the edge pass.                                                                                                                                                                                                                                                                                    |
| **SMAA_MAX_SEARCH_STEPS**      | 16 [0, 112]     | Specifies the maximum steps performed in the horizontal/vertical pattern searches, at each side of the pixel. In number of pixels, it's actually the double. So the maximum line length perfectly handled by, for example 16, is 64 (by perfectly, we meant that longer lines won't look as good, but still antialiased. |
| **SMAA_MAX_SEARCH_STEPS_DIAG** | 8 [0, 20]       | Specifies the maximum steps performed in the diagonal pattern searches, at each side of the pixel. In this case we jump one pixel at time, instead of two.                                                                                                                                                               |
| **SMAA_CORNER_ROUNDING**       | 25 [0, 100]     | Specifies how much sharp corners will be rounded.                                                                                                                                                                                                                                                                        |

Uniforms:

| Name               | Type      | Description                                                     |
| ------------------ | --------- | --------------------------------------------------------------- |
| **uEdgesTexture**  | sampler2D | The framebuffer with edges.                                     |
| **uAreaTexture**   | sampler2D | Precalculated textures loadable from `textures.js` base64 urls. |
| **uSearchTexture** | sampler2D | Precalculated textures loadable from `textures.js` base64 urls. |

---

### `smaa-blend.(vert|frag)`

| Name              | Type      | Description                   |
| ----------------- | --------- | ----------------------------- |
| **uColorTexture** | sampler2D | The input color framebuffer.  |
| **uBlendTexture** | sampler2D | The framebuffer with weights. |

---

## License

Copyright (C) 2013 Jorge Jimenez (jorge@iryoku.com)
Copyright (C) 2013 Jose I. Echevarria (joseignacioechevarria@gmail.com)
Copyright (C) 2013 Belen Masia (bmasia@unizar.es)
Copyright (C) 2013 Fernando Navarro (fernandn@microsoft.com)
Copyright (C) 2013 Diego Gutierrez (diegog@unizar.es)

MIT. See [license file](https://github.com/dmnsgn/glsl-smaa/blob/main/LICENSE.md).
