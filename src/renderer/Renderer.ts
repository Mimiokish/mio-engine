import { RendererParams, HTMLNode, HTMLCanvas, HTMLCanvasContext } from "../declaration";
import { WebGPUCanvas } from "../document-object-model";

export class Renderer {
    #node: HTMLNode;
    #canvas: HTMLCanvas;

    public get canvas(): HTMLCanvas {
        return this.#canvas;
    }
    public set canvas(value: HTMLCanvas) {
        throw Error("MiO-Engine | Renderer - canvas is readonly");
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

        this.#node = document.getElementById("MiO-Engine") as HTMLNode;
        if (!this.#node) {
            console.error("MiO-Engine | Renderer - a node with the ID(MiO-Engine) needs to be create before render");
            return false;
        }

        switch (_contentType) {
            case "WebGPU":
            case "webgpu":
                this.#canvas = new WebGPUCanvas();
                break;
            default:
                this.#canvas = new WebGPUCanvas();
        }

        this.#node.appendChild(this.#canvas.self);

        return true;
    }

    public resize(width: number, height: number): void {
        this.#canvas.resize(width, height);
    }
}
