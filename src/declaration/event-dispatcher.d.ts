import { EnumFunction, EnumObject } from "./";

export type Event = {
    self: EnumObject
    callback: EnumFunction
}

export type EventTypeMouse =
    | "click"
    | "dblclick"
    | "mousedown"
    | "mousemove"
    | "mouseout"
    | "mouseover"
    | "mouseup"
    | "mousewheel"
    | "wheel"

export type EventTypeKeyboard =
    | "keydown"
    | "keypress"
    | "keyup"

export type EventType = EventTypeMouse | EventTypeKeyboard

export type EventMap = Map<EventType, Array<Event>>
