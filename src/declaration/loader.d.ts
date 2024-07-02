import { EnumObject } from "./common";

export type LoaderStatus =
    | "idle"
    | "loading"
    | "processing"
    | "complete"

export type UrlModifier = undefined | ((url: string) => string);

export type GLTFConfig = {
    accessors: Array<Accessors>
    asset: EnumObject
    bufferViews: Array<BufferView>
    buffers: Array<Buffer>
    materials: Array<EnumObject>
    meshes: Array<EnumObject>
    nodes: Array<EnumObject>
    scene: number
    scenes: Array<EnumObject>
}

export type BufferView = {
    buffer: number
    byteLength: number
    byteOffset: number
    target: number
}

export type Buffer = {
    byteLength: number
    uri: string
}

export type Accessors = {
    bufferView: number
    componentType: number
    count: number
    type: string
    max: Array<number>
    min: Array<number>
}
