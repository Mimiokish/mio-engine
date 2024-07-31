import { Mesh } from "./Mesh";
import { WebGPUMeshParameters } from "../declaration";

export class TriangleMesh extends Mesh {
    constructor(params: WebGPUMeshParameters) {
        super(params);

        this.#initialParams();
    }

    #initialParams() {
        this.vertices = new Float32Array([
            0.0, 0.0, 0.5, 1.0, 0.0, 0.0,
            0.0, -0.5, -0.5, 0.0, 1.0, 0.0,
            0.0, 0.5, -0.5, 0.0, 0.0, 1.0
        ]);

        super.createBuffer();

        this.bufferLayout = {
            arrayStride: 24,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: "float32x3"
                },
                {
                    shaderLocation: 1,
                    offset: 12,
                    format: "float32x3"
                }
            ]
        };
    }
}
