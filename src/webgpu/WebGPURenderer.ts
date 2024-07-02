import {WebGPU, WebGPUAdapter, WebGPUContext, WebGPUDevice } from "../declaration";
import { Renderer } from "../renderer";
import { WebGPURenderPass } from "./WebGPURenderPass";

export class WebGPURenderer extends Renderer {
    #webGpu: WebGPU;
    #webGpuAdapter: WebGPUAdapter;
    #webGpuDevice: WebGPUDevice;
    #renderPass: WebGPURenderPass;

    public get device(): WebGPUDevice {
        return this.#webGpuDevice;
    }
    public set device(value: WebGPUDevice) {
        throw Error("MiO-Engine | WebGPURenderer - device is readonly");
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

        this.#renderPass = new WebGPURenderPass({
            context: this.context as WebGPUContext,
            device: this.#webGpuDevice
        });

        return true;
    }
}
