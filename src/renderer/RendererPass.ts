import { RendererPassParams, WebGPUContext } from "../declaration";

export class RendererPass {
    #context: WebGPUContext;

    public get context(): WebGPUContext {
        return this.#context;
    }
    public set context(value: WebGPUContext) {
        throw Error("MiO-Engine | RendererPass - context is readonly");
    }

    constructor(params: RendererPassParams) {
        const _params: RendererPassParams = params;

        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | RendererPass - params is missing");
        } else {
            this.#initialParams(params);
        }
    }

    #initialParams(params: RendererPassParams): void {
        const _params: RendererPassParams = params;

        this.#context = _params.context;
    }
}
