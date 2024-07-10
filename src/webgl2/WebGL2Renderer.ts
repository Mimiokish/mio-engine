import { WebGLRendererParams } from "../declaration/";
import { WebGL2Parameters } from "./WebGL2Parameters";
import { WebGPUCanvas } from "../document-object-model";

export class WebGL2Renderer extends WebGL2Parameters {
    #program: WebGLProgram;

    constructor(params: WebGLRendererParams) {
        super();

        const _params: WebGLRendererParams = params;

        // initial methods - parameters
        this.#initialParams(_params);
    }

    #initialParams(params: WebGLRendererParams): void {
        this.type = "WebGL2";
        this.target = new WebGPUCanvas();
    }
}
