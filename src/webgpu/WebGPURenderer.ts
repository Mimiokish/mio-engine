import { WebGPU, WebGPUAdapter, WebGPUDevice, WebGPUCanvasContext, WebGPUFormat } from "../declaration";
import { Renderer } from "../renderer";
import { Material } from "../objects";
import TriangleWGSL from "../shaders/libs/triangle.wgsl";
import { TriangleMesh } from "../mesh";
import { mat4 } from "gl-matrix";

/**
 * @public
 * @class
 */
export class WebGPURenderer extends Renderer {
    #webGpu: WebGPU;
    #webGpuAdapter: WebGPUAdapter;
    #webGpuDevice: WebGPUDevice;
    #webGpuFormat: WebGPUFormat;
    #material: Material;

    #uniformBuffer: GPUBuffer;
    #bindGroup: GPUBindGroup;
    #pipeline: GPURenderPipeline;

    #triangleMesh: TriangleMesh;

    #temp: number;

    public get device(): WebGPUDevice {
        return this.#webGpuDevice;
    }
    public set device(value: WebGPUDevice) {
        throw Error("MiO-Engine | WebGPURenderer - device is readonly");
    }

    constructor() {
        super({
            contextType: "WebGPU"
        });
    }

    public async initialize(): Promise<boolean> {
        const resultParams: boolean = await this.#initialParams();

        if (!resultParams) {
            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    }

    async #initialParams(): Promise<boolean> {
        this.#webGpu = navigator.gpu;
        if (!this.#webGpu) {
            console.error("MiO-Engine | WebGPURenderer - WebGPU is not supported");
            return Promise.resolve(false);
        }

        this.#webGpuAdapter = await this.#webGpu.requestAdapter() as WebGPUAdapter;
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | WebGPURenderer - WebGPUAdapter initial failed");
            return Promise.resolve(false);
        }

        this.#webGpuDevice = await this.#webGpuAdapter.requestDevice() as WebGPUDevice;
        if (!this.#webGpuDevice) {
            console.error("MiO-Engine | WebGPURenderer - a browser that supports WebGPU is needed");
            return Promise.resolve(false);
        } else {
            this.#material = new Material({
                device: this.#webGpuDevice
            });
        }

        this.#webGpuFormat = "rgba8unorm";

        this.context.configure({
            device: this.#webGpuDevice,
            format: this.#webGpuFormat,
            alphaMode: "opaque"
        });

        return Promise.resolve(true);
    }

    public async createAssets(): Promise<void> {
        this.#triangleMesh = new TriangleMesh({
            device: this.#webGpuDevice
        });

        this.#temp = 0.0;
        // await this.#material.load("http://127.0.0.1:8080/cdn/img/maine_coon.jpg");
        // this.#material.create();
    }

    public createPipeline(): void {
        this.#uniformBuffer = this.#webGpuDevice.createBuffer({
            size: 64 * 3,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const bindGroupLayout: GPUBindGroupLayout = this.#webGpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {}
                }
            ],
        });

        this.#bindGroup = this.#webGpuDevice.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#uniformBuffer
                    }
                }
            ]
        });

        const pipelineLayout: GPUPipelineLayout = this.#webGpuDevice.createPipelineLayout({
            bindGroupLayouts: [ bindGroupLayout ]
        });

        this.#pipeline = this.#webGpuDevice.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: this.#webGpuDevice.createShaderModule({
                    code: TriangleWGSL
                }),
                entryPoint: "vs_main",
                buffers: [
                    this.#triangleMesh.bufferLayout
                ]
            },
            fragment: {
                module: this.#webGpuDevice.createShaderModule({
                    code: TriangleWGSL
                }),
                entryPoint: "fs_main",
                targets: [{
                    format: this.#webGpuFormat
                }]
            },
            primitive: {
                topology: "triangle-list"
            }
        });
    }

    public async render() {
        this.drawTriangle();
    }

    public drawTriangle = (): void => {
        this.#temp += 0.01;
        if (this.#temp > 2.0 * Math.PI) {
            this.#temp -= 2.0 * Math.PI;
        }

        const projection: mat4 = mat4.create();
        mat4.perspective(projection, Math.PI/4, 800/600, 0.1, 10);

        const view: mat4 = mat4.create();
        mat4.lookAt(view, [-2, 0, 2], [0, 0, 0], [0, 0, 1]);

        const model: mat4 = mat4.create();
        mat4.rotate(model, model, this.#temp, [0, 0, 1]);

        this.#webGpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, <ArrayBuffer>model);
        this.#webGpuDevice.queue.writeBuffer(this.#uniformBuffer, 64, <ArrayBuffer>view);
        this.#webGpuDevice.queue.writeBuffer(this.#uniformBuffer, 128, <ArrayBuffer>projection);

        const commandEncoder: GPUCommandEncoder = this.#webGpuDevice.createCommandEncoder();
        const textureView: GPUTextureView = this.context.getCurrentTexture().createView();
        const renderPass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: {
                    r: 1.0,
                    g: 1.0,
                    b: 1.0,
                    a: 1.0
                },
                loadOp: "clear",
                storeOp: "store"
            }]
        });
        renderPass.setPipeline(this.#pipeline);
        renderPass.setVertexBuffer(0, this.#triangleMesh.buffer);
        renderPass.setBindGroup(0, this.#bindGroup);
        renderPass.draw(3, 1, 0, 0);
        renderPass.end();

        this.#webGpuDevice.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(this.drawTriangle);
    };
}
