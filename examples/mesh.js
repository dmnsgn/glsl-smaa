import { mat3, mat4 } from "gl-matrix";

const inverseModelViewMatrix = mat4.create();

class Mesh {
  constructor(modelMatrix) {
    this.modelMatrix = modelMatrix;

    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();
  }

  update(camera) {
    mat4.multiply(this.modelViewMatrix, camera.viewMatrix, this.modelMatrix);

    mat4.invert(inverseModelViewMatrix, this.modelViewMatrix);
    mat3.fromMat4(this.normalMatrix, inverseModelViewMatrix);
    mat3.transpose(this.normalMatrix, this.normalMatrix);
  }
}

export default function createMesh(...args) {
  return new Mesh(...args);
}
