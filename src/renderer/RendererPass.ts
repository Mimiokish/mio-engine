import { RendererPassParams, CanvasNode, CanvasContextType, WebGPUContext } from "../declaration";
import { Canvas } from "../document-object-model";

export class RendererPass {
    #node: CanvasNode;
    #canvas: Canvas;
    #context: null | WebGPUContext;

    public get node(): CanvasNode {
        return this.#node;
    }
    public set node(value: CanvasNode) {
        throw Error("MiO-Engine | node is readonly");
    }

    public get canvas(): Canvas {
        return this.#canvas;
    }
    public set canvas(value: Canvas) {
        throw Error("MiO-Engine | canvas is readonly");
    }

    public get context(): null | WebGPUContext {
        return this.#context;
    }
    public set context(value: null | WebGPUContext) {
        throw Error("MiO-Engine | context is readonly");
    }

    constructor(params: RendererPassParams) {
        this.#initialParams(params);
    }

    #initialParams(params: RendererPassParams): void | boolean {
        const _contextType: CanvasContextType = params.contextType ? params.contextType : "WebGPU";

        this.#node = document.getElementById("MiO-Engine") as HTMLCanvasElement;
        if (!this.#node) {
            console.error("MiO-Engine | a node with the ID(MiO-Engine) needs to be create before render");
            return false;
        }

        this.#canvas = new Canvas();
        this.#node.appendChild(this.#canvas.node);

        // set context
        switch (_contextType) {
            case "WebGPU":
            case "webgpu":
                this.#context = this.#canvas.getContext("webgpu") as WebGPUContext;
                break;
            default:
                this.#context = this.#canvas.getContext("webgpu") as WebGPUContext;
        }
    }
}
