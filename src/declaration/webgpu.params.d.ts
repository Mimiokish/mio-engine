import { WebGPUDevice } from "./webgpu";

export type WebGPURenderPassParameters = {
    context: GPUCanvasContext
}

export type WebGPURenderPipelineParameters = {
    label: string
    code: string
}

export type WebGPUMeshParameters = {
    device: WebGPUDevice
}
