import { cube as createCube, sphere as createSphere } from "primitive-geometry";
import computeNormals from "geom-normals";
import bunnyGeometry from "bunny";

import regl from "./context.js";
import FBO from "./fbos.js";

const COMMANDS = {};

const ready = async () =>
  new Promise(async (resolve, reject) => {
    const glsl = async (url) => {
      try {
        return await (await fetch(new URL(url, import.meta.url))).text();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    };

    // Shaders
    const COPY_VERT = await glsl("./shaders/copy.vert");
    const COPY_FRAG = await glsl("./shaders/copy.frag");
    const DEPTH_FRAG = await glsl("./shaders/depth.frag");

    const ENVMAP_VERT = await glsl("./shaders/envMap.vert");
    const ENVMAP_FRAG = await glsl("./shaders/envMap.frag");
    const MATERIAL_VERT = await glsl("./shaders/material.vert");
    const MATERIAL_FRAG = await glsl("./shaders/material.frag");

    const LAYER_FRAG = await glsl("./shaders/layer.frag");
    const FXAA_FRAG = await glsl("./shaders/fxaa.frag");

    // Lib
    const PRESETS = await glsl("../presets.glsl");
    const EDGES_VERT = await glsl("../edges.vert");
    const LUMA_EDGES_FRAG = await glsl("../edges-luma.frag");
    const COLOR_EDGES_FRAG = await glsl("../edges-color.frag");
    const DEPTH_EDGES_FRAG = await glsl("../edges-depth.frag");

    const SMAA_WEIGHTS_VERT = await glsl("../smaa-weights.vert");
    const SMAA_WEIGHTS_FRAG = await glsl("../smaa-weights.frag");

    const SMAA_BLEND_VERT = await glsl("../smaa-blend.vert");
    const SMAA_BLEND_FRAG = await glsl("../smaa-blend.frag");

    // Env map
    const envMap = regl({
      vert: ENVMAP_VERT,
      frag: ENVMAP_FRAG,
      uniforms: {
        uCameraView: regl.prop("uCameraView"),
        uEnvMap: regl.prop("uEnvMap"),
      },
      attributes: {
        aPosition: [-4, -4, -4, 4, 8, 0],
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
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
        aUv: cubeGeometry.uvs,
      },
      uniforms: {
        uModelMatrix: regl.prop("uModelMatrix"),
        uModelViewMatrix: regl.prop("uModelViewMatrix"),
        uProjectionMatrix: regl.prop("uProjectionMatrix"),
        uCameraPosition: regl.prop("uCameraPosition"),
        uNormalMatrix: regl.prop("uNormalMatrix"),
        uDiffuseColor: regl.prop("uDiffuseColor"),
        uColorMap: regl.prop("uColorMap"),
        uEnvMap: regl.prop("uEnvMap"),
      },
      elements: cubeGeometry.cells,
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
        aUv: sphereGeometry.uvs,
      },
      uniforms: {
        uModelMatrix: regl.prop("uModelMatrix"),
        uModelViewMatrix: regl.prop("uModelViewMatrix"),
        uProjectionMatrix: regl.prop("uProjectionMatrix"),
        uCameraPosition: regl.prop("uCameraPosition"),
        uNormalMatrix: regl.prop("uNormalMatrix"),
        uDiffuseColor: regl.prop("uDiffuseColor"),
        uColorMap: regl.prop("uColorMap"),
        uEnvMap: regl.prop("uEnvMap"),
      },
      elements: sphereGeometry.cells,
    });
    const bunny = regl({
      vert: MATERIAL_VERT,
      frag: MATERIAL_FRAG,
      attributes: {
        aPosition: bunnyGeometry.positions,
        aNormal: computeNormals(bunnyGeometry.positions, bunnyGeometry.cells),
      },
      uniforms: {
        uModelMatrix: regl.prop("uModelMatrix"),
        uModelViewMatrix: regl.prop("uModelViewMatrix"),
        uProjectionMatrix: regl.prop("uProjectionMatrix"),
        uCameraPosition: regl.prop("uCameraPosition"),
        uNormalMatrix: regl.prop("uNormalMatrix"),
        uDiffuseColor: regl.prop("uDiffuseColor"),
        uColorMap: regl.prop("uColorMap"),
        uEnvMap: regl.prop("uEnvMap"),
      },
      elements: bunnyGeometry.cells,
    });

    // TODO: add preset to GUI
    const PRESET = `#define SMAA_PRESET_ULTRA`;

    // SMAA
    const SMAADepthEdges = regl({
      vert: `${PRESET}
    ${PRESETS}
    ${EDGES_VERT}`,
      frag: `${PRESET}
    ${PRESETS}
    ${EDGES_DEPTH_FRAG}`,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        uTexelSize: [1 / regl._gl.drawingBufferWidth, 1 / regl._gl.drawingBufferHeight],
        uDepthTexture: FBO.depth,
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });
    const SMAALumaEdges = regl({
      vert: `${PRESET}
    ${PRESETS}
    ${EDGES_VERT}`,
      frag: `${PRESET}
    ${PRESETS}
    ${EDGES_LUMA_FRAG}`,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        uTexelSize: [1 / regl._gl.drawingBufferWidth, 1 / regl._gl.drawingBufferHeight],
        uTexture: FBO.SMAA,
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });
    const SMAAColorEdges = regl({
      vert: `${PRESET}
    ${PRESETS}
    ${EDGES_VERT}`,
      frag: `${PRESET}
    ${PRESETS}
    // #define SMAA_THRESHOLD 0.1
    // #define SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR 2.0
    ${EDGES_COLOR_FRAG}
    `,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        uTexelSize: [1 / regl._gl.drawingBufferWidth, 1 / regl._gl.drawingBufferHeight],
        uTexture: FBO.SMAA,
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
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
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        uViewportSize: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
        uTexelSize: [1 / regl._gl.drawingBufferWidth, 1 / regl._gl.drawingBufferHeight],
        uEdgesTexture: FBO.edges,
        uSearchTexture: regl.prop("searchTex"),
        uAreaTexture: regl.prop("areaTex"),
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });

    const SMAABlend = regl({
      vert: `${PRESET}
    ${PRESETS}
    ${SMAA_BLEND_VERT}`,
      frag: `${PRESET}
    ${PRESETS}
    ${SMAA_BLEND_FRAG}`,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        uTexelSize: [1 / regl._gl.drawingBufferWidth, 1 / regl._gl.drawingBufferHeight],
        uTexture: FBO.SMAA,
        uBlendTexture: FBO.weights,
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });

    // FXAA
    const FXAA = regl({
      vert: COPY_VERT,
      frag: FXAA_FRAG,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
        texture: FBO.color,
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });

    // SCREEN
    const layers = regl({
      vert: COPY_VERT,
      frag: LAYER_FRAG,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
        background: regl.prop("background"),
        foreground: regl.prop("foreground"),
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });

    const toTexture = regl({
      vert: COPY_VERT,
      frag: COPY_FRAG,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        resolution: [regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight],
        texture: regl.prop("texture"),
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });

    const depth = regl({
      vert: COPY_VERT,
      frag: DEPTH_FRAG,
      attributes: {
        aPosition: [-4, -4, 4, -4, 0, 4],
      },
      uniforms: {
        near: regl.prop("near"),
        far: regl.prop("far"),
        depthTexture: regl.prop("depthTexture"),
      },
      depth: {
        enable: false,
        mask: false,
      },
      count: 3,
    });

    const clear = (alpha) =>
      regl.clear({
        color: [0.0, 0.0, 0.0, alpha ? 0.0 : 1.0],
        depth: 1,
        stencil: 0,
      });

    Object.assign(COMMANDS, {
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
      clear,
    });

    resolve();
  });

export { ready };

export default COMMANDS;
