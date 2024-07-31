import { HTML } from "./HTML";

export class WebGPUCanvas extends HTML {
    public get self(): HTMLCanvasElement {
        return super.self as HTMLCanvasElement;
    }
    public set self(value: HTMLCanvasElement) {
        throw new Error("MiO Engine | WebGPUCanvas - node is readonly");
    }

    public get context(): GPUCanvasContext {
        return this.self.getContext("webgpu") as GPUCanvasContext;
    }
    public set context(value: string) {
        throw new Error("MiO Engine | WebGPUCanvas - context is readonly");
    }

    constructor() {
        super("canvas");
    }

    public resize(width: number, height: number): void {
        this.self.width = width;
        this.self.height = height;
    }
}
