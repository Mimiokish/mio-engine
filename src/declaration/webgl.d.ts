import { EnumObject } from "./common";
import { Canvas } from "../document-object-model";

export type WebGLContext =
    | WebGLRenderingContext
    | WebGL2RenderingContext

export type WebGLContextType =
    | "WebGL"
    | "WebGL2"
    | "WebGPU"

export type WebGLTarget =
    | Canvas

export type WebGLAttributes = {
    gl: WebGLContext;
}

export type WebGLRendererParams =
    | EnumObject
    | {
        canvas: HTMLCanvasElement;
    }
