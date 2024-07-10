import { RenderPassParams, WebGPUCommandEncoder, WebGPUDevice, WebGPUFormat, WebGPURenderPipeline, WebGPUShaderModule, WebGPUTextureView, WebGPURenderPassEncoder } from "../declaration";
import { RenderPass } from "../renderer";
import triangle from "../shaders/libs/triangle.wgsl";
import { TriangleMesh } from "../mesh";

export class WebGPURenderPass extends RenderPass {
    #webGpuDevice: WebGPUDevice;
    #webGpuFormat: WebGPUFormat;
    #webGpuPipeline: WebGPURenderPipeline;

    public get device(): WebGPUDevice {
        return this.#webGpuDevice;
    }
    public set device(value: WebGPUDevice) {
        throw Error("MiO-Engine | WebGPURenderPass - device is readonly");
    }

    constructor(params: RenderPassParams) {
        super(params);

        const _params: RenderPassParams = params;

        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | WebGPURenderPass - params is missing");
        } else {
            this.#initialParams(params).then((): void => {
                this.drawTriangle();
            });
        }
    }

    async #initialParams(params: RenderPassParams): Promise<boolean> {
        const _params: RenderPassParams = params;

        this.#webGpuDevice = _params.device;

        // navigator.gpu.getPreferredCanvasFormat()
        this.#webGpuFormat = "bgra8unorm";

        // try {
        //     this.context.configure({
        //         device: this.#webGpuDevice,
        //         format: this.#webGpuFormat
        //     });
        // } catch (error) {
        //     console.error("MiO-Engine | context configure error: " + error);
        //     return false;
        // }

        return true;
    }

    public createShaderModule(label: string, code: any): WebGPUShaderModule | boolean {
        const _label: string = label;
        const _code: any = code;

        if (!_label || _label === "") {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: label");
            return false;
        }

        if (!_code) {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: code");
            return false;
        }

        return this.#webGpuDevice.createShaderModule({
            label: _label,
            code: _code
        });
    }


    public drawTriangle(): void {
        // console.log("drawing a triangle");
        // const _triangle = new TriangleMesh({
        //     device: this.device
        // });
        //
        // const _pipeline: WebGPURenderPipeline = this.device.createRenderPipeline({
        //     layout: "auto",
        //     vertex: {
        //         module: this.device.createShaderModule({
        //             code: triangle
        //         }),
        //         entryPoint: "vs_main",
        //         buffers: [
        //             _triangle.bufferLayout
        //         ]
        //     },
        //     fragment: {
        //         module: this.device.createShaderModule({
        //             code: triangle
        //         }),
        //         entryPoint: "fs_main",
        //         targets: [{
        //             format: this.#webGpuFormat
        //         }]
        //     },
        //     primitive: {
        //         topology: "triangle-list"
        //     }
        // });
        //
        // const _commandEncoder: WebGPUCommandEncoder = this.device.createCommandEncoder();
        // const _textureView: WebGPUTextureView = this.context.getCurrentTexture().createView();
        // const _renderPass: WebGPURenderPassEncoder = _commandEncoder.beginRenderPass({
        //     colorAttachments: [{
        //         view: _textureView,
        //         clearValue: {
        //             r: 0.0,
        //             g: 0.0,
        //             b: 0.0,
        //             a: 1.0
        //         },
        //         loadOp: "clear",
        //         storeOp: "store"
        //     }]
        // });
        // _renderPass.setPipeline(_pipeline);
        // _renderPass.setVertexBuffer(0, _triangle.buffer);
        // _renderPass.draw(3, 1, 0, 0);
        // _renderPass.end();
        //
        // this.device.queue.submit([_commandEncoder.finish()]);
    }
}
