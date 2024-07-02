export type EnumType = string | number | boolean | null | undefined | ArrayBuffer | Blob | JSON | EnumObject;

export type EnumArray = Array<EnumType | EnumObject>;

export type EnumObject = {
    [key: string]: EnumType | EnumArray | EnumObject | EnumFunction;
}

export type EnumPromise = Promise<EnumType>;

export type EnumFunction = (...args: EnumArray) => void | EnumType | EnumArray | EnumObject | ArrayBuffer | EnumPromise

export type ResponseType =
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"

export type ResponseData =
    | ArrayBuffer
    | Blob
    | JSON
    | string

export type RequestMode =
    | "cors"
    | "no-cors"
    | "same-origin"
    | "navigate"
    | "websocket"

export type RequestCredentials =
    | "omit"
    | "same-origin"
    | "include"

export type RequestConfig = {
    mode: RequestMode
    credentials: RequestCredentials
}

export type RequestHeaders = {
    [key: string]: string
}
