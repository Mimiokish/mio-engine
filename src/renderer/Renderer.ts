import { RendererParams, WebGPUContext } from "../declaration";
import { Canvas } from "../document-object-model";

export class Renderer {
    #node: HTMLCanvasElement;
    #canvas: Canvas;
    #context: WebGPUContext;

    public get context(): WebGPUContext {
        return this.#context;
    }
    public set context(value: WebGPUContext) {
        throw Error("MiO-Engine | context is readonly");
    }

    constructor(params: RendererParams) {
        const _params: RendererParams = params;

        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | Renderer - params is missing");
        } else {
            this.#initialParams(params).then((): void => {
                console.log("MiO-Engine | Renderer - engine is ready to go, enjoy coding~");
            });
        }
    }

    async #initialParams(params: RendererParams): Promise<boolean> {
        const _contentType: string = params.contextType ? params.contextType : "WebGPU";

        this.#node = document.getElementById("MiO-Engine") as HTMLCanvasElement;
        if (!this.#node) {
            console.error("MiO-Engine | Renderer - a node with the ID(MiO-Engine) needs to be create before render");
            return false;
        }

        this.#canvas = new Canvas();
        this.#node.appendChild(this.#canvas.node);

        switch (_contentType) {
            case "WebGPU":
            case "webgpu":
                this.#context = this.#canvas.getContext("webgpu") as WebGPUContext;
                break;
            default:
                this.#context = this.#canvas.getContext("webgpu") as WebGPUContext;
        }

        return true;
    }
}
