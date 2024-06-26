import { WebGPURenderPipelineParameters, WebGPU, WebGPUAdapter, WebGPUContext, WebGPUDevice, WebGPUFormat } from "../declaration";
import { RendererPass } from "../renderer";

export class WebGPURenderPass extends RendererPass {
    #webGpu: WebGPU;
    #webGpuAdapter: WebGPUAdapter;
    #webGpuDevice: WebGPUDevice;
    #webGpuContext: WebGPUContext;
    #webGpuFormat: WebGPUFormat;

    constructor() {
        super({
            contextType: "WebGPU"
        });

        this.#initialParams().then((res: boolean): void => {
            if (res) {
                console.log("MiO-Engine | engine is ready to go, enjoy coding~");

                const size = 4 * 4 + 2 * 4 + 2 * 4;
                const temp = this.#webGpuDevice.createBuffer({
                    size: size,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });
            }
        });
    }

    async #initialParams(): Promise<boolean> {
        this.#webGpu = navigator.gpu;
        if (!this.#webGpu) {
            console.error("MiO-Engine | WebGPU is not supported");
            return false;
        }

        this.#webGpuAdapter = await this.#webGpu.requestAdapter() as WebGPUAdapter;
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | WebGPUAdapter initial failed");
            return false;
        }

        this.#webGpuDevice = await this.#webGpuAdapter.requestDevice() as WebGPUDevice;
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | a browser that supports WebGPU is needed");
            return false;
        }

        this.#webGpuContext = this.context as WebGPUContext;
        try {
            this.#webGpuContext.configure({
                device: this.#webGpuDevice,
                format: navigator.gpu.getPreferredCanvasFormat()
            });
        } catch (error) {
            console.error("MiO-Engine | context configure error: " + error);
            return false;
        }

        return true;
    }

    public createShaderModule(label: string, code: string): GPUShaderModule | boolean {
        const _label: string = label;
        const _code: string = code;

        if (!_label || _label === "") {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: label");
            return false;
        }

        if (!_code || _code === "") {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: code");
            return false;
        }

        const shaderModule: GPUShaderModule = this.#webGpuDevice.createShaderModule({
            label: _label,
            code: _code
        });

        return shaderModule;
    }

    public createRenderPipeline(descriptor: WebGPURenderPipelineParameters): void {}
}
