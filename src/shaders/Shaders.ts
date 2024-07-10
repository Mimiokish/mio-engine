import { ShaderParams, HTMLCanvasContext } from "../declaration";

export class Shaders {
    #key: string;
    #type: number;
    #source: string;
    #context: HTMLCanvasContext;

    constructor(params: ShaderParams) {
        const _key: string = params.key;
        const _type: number = params.type;
        const _source: string = params.source;
        const _context: HTMLCanvasContext = params.context;

        this.#initialParams(_key, _type, _source, _context);
        this.#initialShader();
    }

    #initialParams(key: string, type: number, source: string, context: HTMLCanvasContext): void {
        this.#key = key;
        this.#type = type;
        this.#source = source;
        this.#context = context;
    }

    #initialShader(): void {
        if (!this.#context) {
            throw new Error("MiO Engine | WebGL2RenderingContext is undefined");
        }

        if (!this.#type) {
            throw new Error("MiO Engine | type is undefined");
        }

        if (!this.#source) {
            throw new Error("MiO Engine | source is undefined");
        }

        // const shader: WebGLShader | null = this.#context.createShader(this.#type);
        // if (!shader) {
        //     throw new Error("MiO Engine | shader is null");
        // } else {
        //     this.#gl.shaderSource(shader, this.#source);
        //     this.#gl.compileShader(shader);
        //
        //     const error: string | null = this.#context.getShaderInfoLog(shader);
        //
        //     if (error) {
        //         throw new Error("MiO Engine | shader compile error: " + error);
        //     } else {
        //         this.#shader = shader;
        //     }
        // }
    }
}
