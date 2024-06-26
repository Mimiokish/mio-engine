import { CanvasContextType } from "./canvas.type";
import { WebGPURenderPass } from "../webgpu";

export type RendererParams = {
    contextType: CanvasContextType
}

export type RendererPassParams = {
    contextType: CanvasContextType
}

export type RendererPasses =
    | WebGPURenderPass
