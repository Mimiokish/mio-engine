import { EnumFunction, EnumObject } from "./";

export type Message = {
    self: EnumObject
    callback: EnumFunction
}

export type MessageType =
    | string

export type MessageMap = Map<MessageType, Array<Message>>
