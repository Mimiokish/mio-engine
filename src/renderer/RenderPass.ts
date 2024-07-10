import { RenderPassParams, HTMLCanvasContext } from "../declaration";

export class RenderPass {
    #context: HTMLCanvasContext;

    public get context(): HTMLCanvasContext {
        return this.#context;
    }
    public set context(value: HTMLCanvasContext) {
        throw Error("MiO-Engine | RendererPass - context is readonly");
    }

    constructor(params: RenderPassParams) {
        const _params: RenderPassParams = params;

        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | RendererPass - params is missing");
        } else {
            this.#initialParams(params);
        }
    }

    #initialParams(params: RenderPassParams): void {
        const _params: RenderPassParams = params;

        this.#context = _params.context;
    }
}
