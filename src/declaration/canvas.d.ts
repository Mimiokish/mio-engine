export type CanvasNode = HTMLCanvasElement;

export type CanvasContextType =
    | "2D"
    | "WebGL"
    | "WebGL2"
    | "WebGPU"
    | "BitMapRenderer"
    | "2d"
    | "webgl"
    | "webgl2"
    | "webgpu"
    | "bitmaprenderer"

export type CanvasContext =
    | CanvasRenderingContext2D
    | WebGLRenderingContext
    | WebGL2RenderingContext
    | GPUCanvasContext
    | ImageBitmapRenderingContext
