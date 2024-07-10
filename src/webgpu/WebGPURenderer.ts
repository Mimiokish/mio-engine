import { WebGPU, WebGPUAdapter, WebGPUDevice, WebGPUCanvasContext, WebGPUFormat } from "../declaration";
import { Renderer } from "../renderer";
import { WebGPURenderPass } from "./WebGPURenderPass";

export class WebGPURenderer extends Renderer {
    #webGpu: WebGPU;
    #webGpuAdapter: WebGPUAdapter;
    #webGpuDevice: WebGPUDevice;
    #webGpuContext: WebGPUCanvasContext;
    #webGpuFormat: WebGPUFormat;
    #renderPass: WebGPURenderPass;

    public get device(): WebGPUDevice {
        return this.#webGpuDevice;
    }
    public set device(value: WebGPUDevice) {
        throw Error("MiO-Engine | WebGPURenderer - device is readonly");
    }

    public get context(): WebGPUCanvasContext {
        return this.#webGpuContext;
    }
    public set context(value: WebGPUCanvasContext) {
        throw Error("MiO-Engine | WebGPURenderer - context is readonly");
    }

    public get renderPass(): WebGPURenderPass {
        return this.#renderPass;
    }
    public set renderPass(value: WebGPURenderPass) {
        throw Error("MiO-Engine | WebGPURenderer - renderPass is readonly");
    }

    constructor() {
        super({
            contextType: "WebGPU"
        });

        this.#initialParams().then((): void => {});
    }

    async #initialParams(): Promise<boolean> {
        this.#webGpu = navigator.gpu;
        if (!this.#webGpu) {
            console.error("MiO-Engine | WebGPURenderer - WebGPU is not supported");
            return false;
        }

        this.#webGpuAdapter = await this.#webGpu.requestAdapter() as WebGPUAdapter;
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | WebGPURenderer - WebGPUAdapter initial failed");
            return false;
        }

        this.#webGpuDevice = await this.#webGpuAdapter.requestDevice() as WebGPUDevice;
        if (!this.#webGpuDevice) {
            console.error("MiO-Engine | WebGPURenderer - a browser that supports WebGPU is needed");
            return false;
        }

        this.#webGpuContext = this.canvas.getContext();

        // this.#renderPass = new WebGPURenderPass({
        //     context: this.context,
        //     device: this.#webGpuDevice
        // });

        return true;
    }

    public render(): void {
        const _commandEncoder = this.device.createCommandEncoder();
        const _textureView = this.context.getCurrentTexture().createView();

        const _renderPassDescriptor = {
            colorAttachments: [{
                view: _textureView,
                loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                storeOp: "store"
            }]
        };

        // const _passEncoder = _commandEncoder.beginRenderPass(_renderPassDescriptor);
    }
}
