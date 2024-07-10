import { WebGPUCanvasContext, EnumArray, EnumFunction, } from "../declaration";
import { HTML } from "./HTML";

export class WebGPUCanvas extends HTML {
    public get self(): HTMLCanvasElement {
        return super.self as HTMLCanvasElement;
    }
    public set self(value: HTMLCanvasElement) {
        throw new Error("MiO Engine | node is readonly");
    }

    constructor() {
        super("canvas");
    }

    public getContext(): WebGPUCanvasContext {
        return this.self.getContext("webgpu") as unknown as WebGPUCanvasContext;
    }

    public resize(width: number, height: number): void {
        this.self.width = width;
        this.self.height = height;
    }
}
