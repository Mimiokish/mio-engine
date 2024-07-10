import { EnumObject } from "./common";
import { WebGPUCanvas } from "../document-object-model";

export type WebGLContext =
    | WebGLRenderingContext
    | WebGL2RenderingContext

export type WebGLContextType =
    | "WebGL"
    | "WebGL2"
    | "WebGPU"

export type WebGLTarget =
    | WebGPUCanvas

export type WebGLAttributes = {
    gl: WebGLContext;
}

export type WebGLRendererParams =
    | EnumObject
    | {
        canvas: HTMLCanvasElement;
    }
