import { WebGPUMeshParameters, WebGPUDevice, WebGPUBuffer, WebGPUBufferDescriptor, WebGPUBufferLayout, WebGPUBufferUsageFlags } from "../declaration";

export class Mesh {
    #vertices: Float32Array;
    #webGpuDevice: WebGPUDevice;
    #webGpuBuffer: WebGPUBuffer;
    #webGpuBufferLayout: WebGPUBufferLayout;
    #webGpuBufferUsage: WebGPUBufferUsageFlags;
    #webGpuBufferDescriptor: WebGPUBufferDescriptor;

    public get vertices(): Float32Array {
        return this.#vertices;
    }
    public set vertices(value: Float32Array) {
        this.#vertices = value;
    }

    public get buffer(): WebGPUBuffer {
        return this.#webGpuBuffer;
    }
    public set buffer(value: WebGPUBuffer) {
        this.#webGpuBuffer = value;
    }

    public get bufferLayout(): WebGPUBufferLayout {
        return this.#webGpuBufferLayout;
    }
    public set bufferLayout(value: WebGPUBufferLayout) {
        this.#webGpuBufferLayout = value;
    }

    public get bufferDescriptor(): WebGPUBufferDescriptor {
        return this.#webGpuBufferDescriptor;
    }
    public set bufferDescriptor(value: WebGPUBufferDescriptor) {
        this.#webGpuBufferDescriptor = value;
    }

    constructor(params: WebGPUMeshParameters) {
        const _params: WebGPUMeshParameters = params;

        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | Mesh - params is missing");
        } else {
            this.#initialParams(params);
        }
    }

    #initialParams(params: WebGPUMeshParameters): void {
        this.#webGpuDevice = params.device;
        this.#webGpuBufferUsage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
    }

    protected createBuffer(): void {
        if (!this.#webGpuDevice) {
            console.warn("MiO-Engine | Mesh - createBuffer - webGpuDevice is missing");
            return;
        } else {
            this.#webGpuBufferDescriptor = {
                size: this.#vertices.byteLength,
                usage: this.#webGpuBufferUsage,
                mappedAtCreation: true
            };
            this.#webGpuBuffer = this.#webGpuDevice.createBuffer(this.#webGpuBufferDescriptor);
            new Float32Array(this.#webGpuBuffer.getMappedRange()).set(this.#vertices);
            this.#webGpuBuffer.unmap();
        }
    }
}
