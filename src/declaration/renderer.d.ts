import { CanvasContextType, WebGPUContext, WebGPUDevice } from "../declaration";
import { WebGPURenderPass } from "../webgpu";

export type RendererParams = {
    contextType: CanvasContextType
}

export type RenderPassParams = {
    context: WebGPUContext
    device: WebGPUDevice
}

export type RenderPasses =
    | WebGPURenderPass
