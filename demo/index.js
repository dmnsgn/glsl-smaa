const { mat4 } = require("gl-matrix");
const dat = require("dat.gui");
const createCamera = require("perspective-camera");
const createOrbitControls = require("orbit-controls");

const regl = require("./context.js");
const createMesh = require("./mesh.js");

const FBO = require("./fbos.js");
const COMMANDS = require("./commands.js");
const { loadTexture, loadHdrTexture } = require("./utils.js");

const SMAATextures = require("../textures.js");

/**
 * SETUP
 */
const TEXTURES = new Map();

// Camera and controls
const camera = createCamera({
  fov: Math.PI / 4,
  near: 0.001,
  far: 100,
  viewport: [0, 0, window.innerWidth, window.innerHeight]
});
const controls = createOrbitControls({
  position: [0, 0, 0.4]
});

// Entities
const cube = createMesh(
  mat4.fromRotationTranslationScale(
    new Float32Array(16),
    [0, 0, 0, 1],
    [0, 0, -1],
    [1, 1, 1]
  )
);

const sphere = createMesh(
  mat4.fromRotationTranslationScale(
    new Float32Array(16),
    [0, 0, 0, 1],
    [-0.25, 0, 0],
    [0.3, 0.3, 0.3]
  )
);

const bunny = createMesh(
  mat4.fromRotationTranslationScale(
    new Float32Array(16),
    [0, 0, 0, 1],
    [0.25, -0.25, 0],
    [0.05, 0.05, 0.05]
  )
);

// GUI
const gui = new dat.GUI({ load: JSON, preset: "test" });
const options = {
  aa: "smaa",
  separateBackground: true,
  edges: "color",
  output: "color"
};
gui.add(options, "aa", ["browser", "fxaa", "smaa"]).name("AA");
gui.add(options, "edges", ["depth", "luma", "color"]).name("SMAA edges");
gui.add(options, "separateBackground").name("Separate BG");
gui.add(options, "output", Object.keys(FBO)).name("Output");

/**
 * FRAME
 */

const drawMeshes = () => {
  cube.update(camera);
  sphere.update(camera);
  bunny.update(camera);

  COMMANDS.cube({
    uModelMatrix: cube.modelMatrix,
    uModelViewMatrix: cube.modelViewMatrix,
    uNormalMatrix: cube.normalMatrix,
    uProjectionMatrix: camera.projection,
    uCameraPosition: camera.position,
    uDiffuseColor: [0.0, 0.0, 0.0, 1.0],
    uColorMap: TEXTURES.get("checkerTexture"),
    // uColorMap: TEXTURES.get("colorTexture"),
    uEnvMap: TEXTURES.get("envMap")
  });
  COMMANDS.sphere({
    uModelMatrix: sphere.modelMatrix,
    uModelViewMatrix: sphere.modelViewMatrix,
    uNormalMatrix: sphere.normalMatrix,
    uProjectionMatrix: camera.projection,
    uCameraPosition: camera.position,
    uDiffuseColor: [0.0, 0.0, 0.0, 1.0],
    uColorMap: TEXTURES.get("colorTexture"),
    // uColorMap: TEXTURES.get("checkerTexture"),
    uEnvMap: TEXTURES.get("envMap")
  });
  COMMANDS.bunny({
    uModelMatrix: bunny.modelMatrix,
    uModelViewMatrix: bunny.modelViewMatrix,
    uNormalMatrix: bunny.normalMatrix,
    uProjectionMatrix: camera.projection,
    uCameraPosition: camera.position,
    uDiffuseColor: [0.3, 0.3, 0.3, 1.0],
    uEnvMap: TEXTURES.get("envMap")
  });
};

const frame = ({ viewportWidth, viewportHeight }) => {
  // Update controls and camera
  controls.update();
  controls.copyInto(camera.position, camera.direction, camera.up);
  camera.update();

  // Clear back buffer
  COMMANDS.clear();

  // Draw background
  if (options.separateBackground) {
    FBO.background.resize(viewportWidth, viewportHeight);
    FBO.background.use(() => {
      COMMANDS.clear();
      COMMANDS.envMap({
        uCameraView: camera.view,
        uEnvMap: TEXTURES.get("envMap")
      });
    });
  }

  // Draw scene
  FBO.color.resize(viewportWidth, viewportHeight);
  FBO.color.use(() => {
    COMMANDS.clear(true);
    if (!options.separateBackground) {
      COMMANDS.envMap({
        uCameraView: camera.view,
        uEnvMap: TEXTURES.get("envMap")
      });
    }
    drawMeshes();
  });

  // Draw depth
  FBO.depth.resize(viewportWidth, viewportHeight);
  FBO.depth.use(() => {
    COMMANDS.clear();
    COMMANDS.depth({
      depthTexture: FBO.color.depthStencil,
      near: camera.near,
      far: camera.far
    });
  });

  // Compare FXAA and SMAA
  if (options.aa === "fxaa") {
    FBO.FXAA.resize(viewportWidth, viewportHeight);

    FBO.FXAA.use(() => {
      COMMANDS.clear();
      COMMANDS.FXAA();
    });

    FBO.color.use(() => {
      COMMANDS.clear();
      COMMANDS.toTexture({ texture: FBO.FXAA });
    });
  } else if (options.aa === "smaa") {
    FBO.SMAA.resize(viewportWidth, viewportHeight);
    FBO.edges.resize(viewportWidth, viewportHeight);
    FBO.weights.resize(viewportWidth, viewportHeight);

    FBO.SMAA.use(() => {
      COMMANDS.clear();
      COMMANDS.toTexture({ texture: FBO.color });
    });

    FBO.edges.use(() => {
      COMMANDS.clear();
      if (options.edges === "depth") {
        COMMANDS.SMAADepthEdges();
      } else if (options.edges === "luma") {
        COMMANDS.SMAALumaEdges();
      } else if (options.edges === "color") {
        COMMANDS.SMAAColorEdges();
      }
    });

    FBO.weights.use(() => {
      COMMANDS.clear();
      if (TEXTURES.has("searchTexture") && TEXTURES.has("areaTexture")) {
        COMMANDS.SMAAWeights({
          searchTex: TEXTURES.get("searchTexture"),
          areaTex: TEXTURES.get("areaTexture")
        });
      }
    });

    FBO.color.use(() => {
      COMMANDS.clear();
      COMMANDS.SMAABlend();
    });
  }

  // Blit
  if (options.separateBackground) {
    COMMANDS.layers({
      background: FBO.background,
      foreground: FBO[options.output]
    });
  } else {
    COMMANDS.toTexture({ texture: FBO[options.output] });
  }
};

function frameCatch(frameFunc) {
  const loop = regl.frame((...args) => {
    try {
      frameFunc(...args);
    } catch (err) {
      loop.cancel();
      throw err;
    }
  });
}

/**
 * LOAD & START
 */
(async () => {
  const hdrTexture = await loadHdrTexture("demo/assets/studio_small_03_1k.hdr");
  TEXTURES.set("envMap", hdrTexture);

  const colorTexture = await loadTexture("demo/assets/plastic-basecolor.png");
  // const colorTexture = await loadTexture("demo/assets/diffuse.png");
  TEXTURES.set("colorTexture", colorTexture);

  const checkerTexture = await loadTexture("demo/assets/checker.jpg");
  TEXTURES.set("checkerTexture", checkerTexture);

  const searchTexture = await loadTexture(SMAATextures.search, {
    format: "rgba",
    type: "half float",
    flipY: true,
  });
  TEXTURES.set("searchTexture", searchTexture);

  const areaTexture = await loadTexture(SMAATextures.area, {
    min: "linear",
    format: "rgba",
    type: "half float",
    flipY: true,
  });
  TEXTURES.set("areaTexture", areaTexture);

  // RAF
  frameCatch(frame);
})();
