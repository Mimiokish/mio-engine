import {RendererParams } from "../declaration";
import { RendererPass } from "../renderer";
import { WebGPURenderPass } from "../webgpu";

export class Renderer {
    #renderPass: null | RendererPass | WebGPURenderPass;

    public get renderPass(): null | RendererPass | WebGPURenderPass {
        return this.#renderPass;
    }
    public set renderPass(value: null | RendererPass | WebGPURenderPass) {
        throw Error("MiO-Engine | renderPass is readonly");
    }

    constructor(params: RendererParams) {
        this.#initialParams(params);
    }

    #initialParams(params: RendererParams): void {
        const _contentType: string = params.contextType ? params.contextType : "WebGPU";

        switch (_contentType) {
            case "WebGPU":
            case "webgpu":
                this.#renderPass = new WebGPURenderPass();
                break;
            default:
                this.#renderPass = new WebGPURenderPass();
        }
    }
}
