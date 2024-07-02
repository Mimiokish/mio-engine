import { CanvasContextType, WebGPUContext, WebGPUDevice } from "../declaration";
import { WebGPURenderPass } from "../webgpu";

export type RendererParams = {
    contextType: CanvasContextType
}

export type RendererPassParams = {
    context: WebGPUContext
    device: WebGPUDevice
}

export type RendererPasses =
    | WebGPURenderPass
