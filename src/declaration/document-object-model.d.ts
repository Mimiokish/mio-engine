import { WebGPUCanvas } from "../document-object-model";

export type HTMLTagName =
    | "canvas"
    | "div";

export type HTMLNode =
    | HTMLElement
    | HTMLCanvasElement

export type HTMLCanvas =
    | WebGPUCanvas

export type HTMLCanvasContextType =
    | "2d"
    | "webgl"
    | "webgl2"
    | "webgpu"
    | "bitmaprenderer"

export type HTMLCanvasContext =
    | RenderingContext

export type Web2DCanvasContext = CanvasRenderingContext2D;

export type WebGLCanvasContext = WebGLRenderingContext;

export type WebGL2CanvasContext = WebGL2RenderingContext;

export type WebGPUCanvasContext = GPUCanvasContext;

export type ImageBitmapCanvasContext = ImageBitmapRenderingContext;
