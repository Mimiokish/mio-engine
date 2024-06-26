import { Renderer } from "../renderer";

export class WebGPURenderer extends Renderer {
    constructor() {
        super({
            contextType: "WebGPU"
        });

        this.#initialParams();
    }

    #initialParams(): void {
    }
}
