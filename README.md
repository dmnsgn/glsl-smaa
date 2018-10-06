# glsl-smaa [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

SMAA (Enhanced Subpixel Morphological Antialiasing) post-processing; WebGL (OpenGL ES 2.0) implementation with no fluff. All credit goes to the incredible work [here (iryoku)](http://www.iryoku.com/smaa/) and [there (beakbeak)](https://github.com/beakbeak/smaa-webgl).

## Installation

```bash
npm install glsl-smaa
```

[![NPM](https://nodei.co/npm/glsl-smaa.png)](https://nodei.co/npm/glsl-smaa/)

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

See the [demo](https://dmnsgn.github.io/glsl-smaa/) and its [source](demo/index.js) for an example with [REGL](http://regl.party/).

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
${SMAA_WEIGHTS_FRAG}
`;
```

### `edges.vert`

N/A

### `edges-<edge-detection-method>.frag`

You can use one of the 3 following edge detection method:

- Depth: the fastest but it may miss some edges.

- Luma: more expensive than depth edge detection, but catches visible edges that depth edge detection can miss.

- Color: the most expensive one but catches chroma-only edges.

![](https://raw.githubusercontent.com/dmnsgn/glsl-smaa/master/demo/preview-edges.gif)

Defines:

```glsl
#define SMAA_THRESHOLD 0.1
#define SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR 2.0
```

| Name                                      | Default [Range] | Description                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SMAA_THRESHOLD**                        | 0.1 [0, 0.5]    | Specifies the threshold or sensitivity to edges. Lowering this value you will be able to detect more edges at the expense of performance. Range: [0, 0.5]. 0.1 is a reasonable value, and allows to catch most visible edges. 0.05 is a rather overkill value, that allows to catch 'em all.                                          |
| **SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR** | 2.0             | If there is an neighbor edge that has SMAA_LOCAL_CONTRAST_FACTOR times bigger contrast than current edge, current edge will be discarded. This allows to eliminate spurious crossing edges, and is based on the fact that, if there is too much contrast in a direction, that will hide perceptually contrast in the other neighbors. |

Uniforms:

#### `luma-edges.frag`

| Name         | Type      | Description                  |
| ------------ | --------- | ---------------------------- |
| **colorTex** | sampler2D | The input color framebuffer. |

#### `color-edges.frag`

| Name         | Type      | Description                  |
| ------------ | --------- | ---------------------------- |
| **colorTex** | sampler2D | The input color framebuffer. |

#### `depth-edges.frag`

| Name         | Type      | Description                  |
| ------------ | --------- | ---------------------------- |
| **depthTex** | sampler2D | The input depth framebuffer. |

---

### `smaa-weights.(vert|frag)`

Defines:

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

| Name          | Type      | Description                                                     |
| ------------- | --------- | --------------------------------------------------------------- |
| **edgesTex**  | sampler2D | The framebuffer with edges.                                     |
| **areaTex**   | sampler2D | Precalculated textures loadable from `textures.js` base64 urls. |
| **searchTex** | sampler2D | Precalculated textures loadable from `textures.js` base64 urls. |

---

### `smaa-blend.(vert|frag)`

| Name         | Type      | Description                   |
| ------------ | --------- | ----------------------------- |
| **colorTex** | sampler2D | The input color framebuffer.  |
| **blendTex** | sampler2D | The framebuffer with weights. |

---

## License

Copyright (C) 2013 Jorge Jimenez (jorge@iryoku.com)
Copyright (C) 2013 Jose I. Echevarria (joseignacioechevarria@gmail.com)
Copyright (C) 2013 Belen Masia (bmasia@unizar.es)
Copyright (C) 2013 Fernando Navarro (fernandn@microsoft.com)
Copyright (C) 2013 Diego Gutierrez (diegog@unizar.es)

MIT. See [license file](https://github.com/dmnsgn/glsl-smaa/blob/master/LICENSE.md).
