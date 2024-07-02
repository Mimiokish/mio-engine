class DocumentObjectModel {
    #node;
    get node() {
        return this.#node;
    }
    set node(value) {
        throw new Error("MiO Engine | node is readonly");
    }
    constructor(tagName) {
        this.#initialParams(tagName);
    }
    #initialParams(tagName) {
        const _tagName = tagName;
        if (!_tagName) {
            this.#node = document.createElement("div");
        }
        else {
            this.#node = document.createElement(_tagName);
        }
    }
    async appendToBody() {
        try {
            if (!this.#node) {
                console.log("MiO Engine | node is not found");
                return Promise.resolve(false);
            }
            if (document.readyState === "complete") {
                document.body.appendChild(this.#node);
                return Promise.resolve(true);
            }
            else {
                return new Promise((resolve) => {
                    const eventFn = () => {
                        document.body.appendChild(this.#node);
                        document.removeEventListener("DOMContentLoaded", eventFn);
                        resolve(true);
                    };
                    document.addEventListener("DOMContentLoaded", eventFn);
                });
            }
        }
        catch (error) {
            console.log("MiO Engine | node append to body message: ", error);
            return Promise.resolve(false);
        }
    }
    async appendToElement(nodeId) {
        try {
            const _nodeId = nodeId;
            if (!_nodeId) {
                console.log("MiO Engine | nodeId is needed");
                return Promise.resolve(false);
            }
            if (!this.#node) {
                console.log("MiO Engine | node is not found");
                return Promise.resolve(false);
            }
            if (document.readyState === "complete") {
                const nodeParent = document.getElementById(_nodeId);
                if (!nodeParent) {
                    console.log("MiO Engine | parent node with id " + _nodeId + " is not found");
                    return Promise.resolve(false);
                }
                nodeParent.appendChild(this.#node);
                return Promise.resolve(true);
            }
            else {
                return new Promise((resolve) => {
                    const eventFn = () => {
                        if (this.#node) {
                            const nodeParent = document.getElementById(_nodeId);
                            if (!nodeParent) {
                                console.log("MiO Engine | parent node with id " + _nodeId + " is not found");
                                resolve(false);
                            }
                            else {
                                nodeParent.appendChild(this.#node);
                                document.removeEventListener("DOMContentLoaded", eventFn);
                                resolve(true);
                            }
                        }
                    };
                    document.addEventListener("DOMContentLoaded", eventFn);
                });
            }
        }
        catch (error) {
            console.log("MiO Engine | node append to " + nodeId + " element message: ", error);
            return Promise.resolve(false);
        }
    }
}

class Canvas extends DocumentObjectModel {
    get node() {
        return super.node;
    }
    constructor() {
        super("canvas");
    }
    getContext(type) {
        return this.node.getContext(type);
    }
    updateSize(width, height) {
        this.node.width = width;
        this.node.height = height;
    }
    addEventListener(type, fn, ...args) {
        window.addEventListener(type, () => {
            fn.call(null, ...args);
        });
    }
}

class Renderer {
    #node;
    #canvas;
    #context;
    get context() {
        return this.#context;
    }
    set context(value) {
        throw Error("MiO-Engine | context is readonly");
    }
    constructor(params) {
        const _params = params;
        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | Renderer - params is missing");
        }
        else {
            this.#initialParams(params).then(() => {
                console.log("MiO-Engine | Renderer - engine is ready to go, enjoy coding~");
            });
        }
    }
    async #initialParams(params) {
        const _contentType = params.contextType ? params.contextType : "WebGPU";
        this.#node = document.getElementById("MiO-Engine");
        if (!this.#node) {
            console.error("MiO-Engine | Renderer - a node with the ID(MiO-Engine) needs to be create before render");
            return false;
        }
        this.#canvas = new Canvas();
        this.#node.appendChild(this.#canvas.node);
        switch (_contentType) {
            case "WebGPU":
            case "webgpu":
                this.#context = this.#canvas.getContext("webgpu");
                break;
            default:
                this.#context = this.#canvas.getContext("webgpu");
        }
        return true;
    }
}

class RendererPass {
    #context;
    get context() {
        return this.#context;
    }
    set context(value) {
        throw Error("MiO-Engine | RendererPass - context is readonly");
    }
    constructor(params) {
        const _params = params;
        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | RendererPass - params is missing");
        }
        else {
            this.#initialParams(params);
        }
    }
    #initialParams(params) {
        const _params = params;
        this.#context = _params.context;
    }
}

var triangle = "struct Fragment {\r\n    @builtin(position) Position : vec4<f32>,\r\n    @location(0) Color : vec4<f32>\r\n};\r\n\r\n@vertex\r\nfn vs_main(@builtin(vertex_index) v_id: u32) -> Fragment {\r\n    var positions = array<vec2<f32>, 3> (\r\n        vec2<f32>( 0.0, 0.5),\r\n        vec2<f32>( -0.5, -0.5),\r\n        vec2<f32>( 0.5, -0.5),\r\n    );\r\n\r\n    var colors = array<vec3<f32>, 3> (\r\n        vec3<f32>(1.0, 0.0, 0.0),\r\n        vec3<f32>(0.0, 1.0, 0.0),\r\n        vec3<f32>(0.0, 0.0, 1.0),\r\n    );\r\n\r\n    var output : Fragment;\r\n    output.Position = vec4<f32>(positions[v_id], 0.0, 1.0);\r\n    output.Color = vec4<f32>(colors[v_id], 1.0);\r\n\r\n    return output;\r\n};\r\n\r\n@fragment\r\nfn fs_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {\r\n    return Color;\r\n}\r\n";

class WebGPURenderPass extends RendererPass {
    #webGpuDevice;
    #webGpuFormat;
    #webGpuPipeline;
    get device() {
        return this.#webGpuDevice;
    }
    set device(value) {
        throw Error("MiO-Engine | WebGPURenderPass - device is readonly");
    }
    constructor(params) {
        super(params);
        const _params = params;
        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | WebGPURenderPass - params is missing");
        }
        else {
            this.#initialParams(params).then(() => {
                this.drawTriangle();
            });
        }
    }
    async #initialParams(params) {
        const _params = params;
        this.#webGpuDevice = _params.device;
        // navigator.gpu.getPreferredCanvasFormat()
        this.#webGpuFormat = "bgra8unorm";
        try {
            this.context.configure({
                device: this.#webGpuDevice,
                format: this.#webGpuFormat
            });
        }
        catch (error) {
            console.error("MiO-Engine | context configure error: " + error);
            return false;
        }
        return true;
    }
    createShaderModule(label, code) {
        const _label = label;
        const _code = code;
        if (!_label || _label === "") {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: label");
            return false;
        }
        if (!_code) {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: code");
            return false;
        }
        return this.#webGpuDevice.createShaderModule({
            label: _label,
            code: _code
        });
    }
    drawTriangle() {
        console.log("drawing a triangle");
        const _pipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.device.createShaderModule({
                    code: triangle
                }),
                entryPoint: "vs_main"
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: triangle
                }),
                entryPoint: "fs_main",
                targets: [{
                        format: this.#webGpuFormat
                    }]
            },
            primitive: {
                topology: "triangle-list"
            }
        });
        const _commandEncoder = this.device.createCommandEncoder();
        const _textureView = this.context.getCurrentTexture().createView();
        const _renderPass = _commandEncoder.beginRenderPass({
            colorAttachments: [{
                    view: _textureView,
                    clearValue: {
                        r: 0.5,
                        g: 0.0,
                        b: 0.25,
                        a: 1.0
                    },
                    loadOp: "clear",
                    storeOp: "store"
                }]
        });
        _renderPass.setPipeline(_pipeline);
        _renderPass.draw(3, 1, 0, 0);
        _renderPass.end();
        this.device.queue.submit([_commandEncoder.finish()]);
    }
}

class WebGPURenderer extends Renderer {
    #webGpu;
    #webGpuAdapter;
    #webGpuDevice;
    #renderPass;
    get device() {
        return this.#webGpuDevice;
    }
    set device(value) {
        throw Error("MiO-Engine | WebGPURenderer - device is readonly");
    }
    get renderPass() {
        return this.#renderPass;
    }
    set renderPass(value) {
        throw Error("MiO-Engine | WebGPURenderer - renderPass is readonly");
    }
    constructor() {
        super({
            contextType: "WebGPU"
        });
        this.#initialParams().then(() => { });
    }
    async #initialParams() {
        this.#webGpu = navigator.gpu;
        if (!this.#webGpu) {
            console.error("MiO-Engine | WebGPURenderer - WebGPU is not supported");
            return false;
        }
        this.#webGpuAdapter = await this.#webGpu.requestAdapter();
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | WebGPURenderer - WebGPUAdapter initial failed");
            return false;
        }
        this.#webGpuDevice = await this.#webGpuAdapter.requestDevice();
        if (!this.#webGpuDevice) {
            console.error("MiO-Engine | WebGPURenderer - a browser that supports WebGPU is needed");
            return false;
        }
        this.#renderPass = new WebGPURenderPass({
            context: this.context,
            device: this.#webGpuDevice
        });
        return true;
    }
}

class WebGL2Parameters {
    #type;
    #target;
    get type() {
        return this.#type;
    }
    set type(type) {
        this.#type = type;
    }
    get target() {
        return this.#target;
    }
    set target(target) {
        this.#target = target;
    }
    constructor() {
        this.type = "";
        this.target = null;
    }
}

class WebGL2Renderer extends WebGL2Parameters {
    #program;
    constructor(params) {
        super();
        const _params = params;
        // initial methods - parameters
        this.#initialParams(_params);
    }
    #initialParams(params) {
        this.type = "WebGL2";
        this.target = new Canvas();
    }
}

class LoaderController {
    #status;
    #queue;
    constructor() {
        this.#initialParams();
    }
    #initialParams() {
        this.#status = "idle";
    }
    get status() {
        return this.#status;
    }
    set status(status) {
        this.#status = status;
    }
    get queue() {
        return this.#queue;
    }
    set queue(queue) {
        throw new Error("MiO Engine | LoaderController - queue is readonly");
    }
    set(key, type) {
        const _key = key;
        if (!_key) {
            console.error(new Error("MiO Engine | LoaderController - set failed: key is required"));
            return;
        }
        this.#queue.set(_key, type);
    }
    delete(url) {
        this.#queue.delete(url);
    }
}

class Loader {
    #controller;
    #urlModifier;
    #requestConfig;
    #requestHeaders;
    get controller() {
        return this.#controller;
    }
    set controller(controller) {
        throw new Error("MiO Engine | Loader - controller is readonly");
    }
    get urlModifier() {
        return this.#urlModifier;
    }
    set urlModifier(urlModifier) {
        this.#urlModifier = urlModifier;
    }
    /**
     * @description request config
     */
    get requestConfig() {
        return this.#requestConfig;
    }
    set requestConfig(value) {
        throw new Error("MiO Engine | Loader - requestConfig is readonly");
    }
    get requestMode() {
        return this.#requestConfig.mode;
    }
    set requestMode(value) {
        this.#requestConfig.mode = value;
    }
    get requestCredentials() {
        return this.#requestConfig.credentials;
    }
    set requestCredentials(value) {
        this.#requestConfig.credentials = value;
    }
    /**
     * @description request headers
     */
    get requestHeaders() {
        return this.#requestHeaders;
    }
    set requestHeaders(value) {
        throw new Error("MiO Engine | Loader - requestHeaders is readonly");
    }
    constructor() {
        this.#initialParams();
    }
    #initialParams() {
        this.#controller = new LoaderController();
        this.urlModifier = undefined;
        // set default request config
        this.#requestConfig = {
            mode: "cors",
            credentials: "include"
        };
        // set default request headers
        this.#requestHeaders = {};
    }
    resolveURL(url) {
        const _url = url;
        if (!_url) {
            console.error(new Error("MiO Engine | Loader - resolveURL failed: url is required"));
            return "";
        }
        if (this.urlModifier) {
            return this.urlModifier(_url);
        }
        return _url;
    }
    async handleResponseStatus(response) {
        try {
            if (!response.ok) {
                return Promise.reject("failed to fetch from url");
            }
            if (response.status !== 200) {
                return Promise.reject("response status " + response.status + " received");
            }
            return Promise.resolve(true);
        }
        catch (error) {
            return Promise.reject("failed to handle response status: " + error);
        }
    }
    async fetch(url) {
        try {
            const req = new Request(url, {
                headers: new Headers(this.requestHeaders)
            });
            const response = await fetch(req);
            const responseStatus = await this.handleResponseStatus(response);
            if (!responseStatus) {
                return Promise.reject(false);
            }
            return Promise.resolve(response);
        }
        catch (error) {
            return Promise.reject("failed to fetch from url with unknown message: " + error);
        }
    }
}

class GLTFLoader extends Loader {
    constructor() {
        super();
        this.#initialParams();
    }
    #initialParams() {
        this.requestMode = "cors";
        this.requestCredentials = "same-origin";
    }
    async load(url) {
        try {
            const _url = this.resolveURL(url);
            const response = await this.fetch(_url);
            if (response instanceof Error || !response) {
                console.error(new Error("MiO Engine | GLTFLoader - file load failed: unknown"));
                return Promise.resolve(false);
            }
            const cfgGltf = await response.json();
            const path = _url.split("/").slice(0, -1).join("/");
            // console.log("GLTF | Raw: ", cfgGltf);
            const indexBufferView = 0;
            const bufferView = cfgGltf.bufferViews[indexBufferView];
            // console.log("GLTF | BufferView: ", bufferView);
            if (bufferView) {
                // get current buffer info
                const indexBuffer = bufferView.buffer;
                const byteOffset = bufferView.byteOffset;
                const byteLength = bufferView.byteLength;
                // get current buffer data
                const buffer = cfgGltf.buffers[indexBuffer];
                const bufferUri = buffer.uri;
                const DataBin = await super.fetch(path + "/" + bufferUri);
                console.log("GLTF | Bin Data: ", DataBin);
                if ("arrayBuffer" in DataBin) {
                    const bufferViewData = new Uint8Array(await DataBin.arrayBuffer(), byteOffset, byteLength);
                    console.log("GLTF | Array Buffer: ", bufferViewData);
                }
            }
            return Promise.resolve(true);
        }
        catch (error) {
            console.error(new Error("MiO Engine | GLTFLoader - file load failed: " + error));
            return Promise.resolve(false);
        }
    }
}

/**
 * @description event dispatcher
 */
class EventDispatcher {
    #eventMap;
    constructor() {
        this.#eventMap = new Map();
    }
    get eventMap() {
        return this.#eventMap;
    }
    set eventMap(value) {
        throw new Error("MiO Engine | eventMap is readonly");
    }
    /**
     * @description register an event
     * @param {EventType} type
     * @param {EnumFunction} callback
     * @param {EnumObject} self
     */
    registerEvent(type, callback, self) {
        if (!type || !callback || !self) {
            throw new Error("MiO Engine | Invalid arguments");
        }
        if (!this.#eventMap.has(type)) {
            this.#eventMap.set(type, []);
        }
        const eventList = this.#eventMap.get(type);
        if (eventList) {
            eventList.push({ callback, self });
        }
    }
    /**
     * @description dispatch an event
     * @param {EventType} type
     * @param {EnumObject} source
     */
    dispatchEvent(type, source) {
        const eventList = this.#eventMap.get(type);
        if (eventList) {
            eventList.forEach((event) => {
                event.callback.call(event.self, source);
            });
        }
    }
    /**
     * @description remove an event
     * @param {EventType} type
     * @param {EnumFunction} callback
     * @param {EnumObject} self
     */
    removeEvent(type, callback, self) {
        const eventList = this.#eventMap.get(type);
        if (eventList) {
            this.#eventMap.set(type, eventList.filter(event => event.callback !== callback || event.self !== self));
        }
    }
    /**
     * @description remove all event
     */
    clearEvent() {
        this.#eventMap.clear();
    }
}

class UtilsGeneral {
    constructor() {
        this.#initialParams();
    }
    #initialParams() {
    }
    /**
     * @description Generate a random hexadecimal string
     */
    GenerateHex() {
        // Generate an array of random bytes (16 bytes total)
        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);
        // Set the version (4) and variant (2 bits 10) as per RFC4122
        randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Set the version to 4
        randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Set the variant to 10
        // Convert the random bytes to a hexadecimal string
        return Array.from(randomBytes, byte => byte.toString(16).padStart(2, "0"));
    }
    /**
     * @description Generate a version 4 UUID
     */
    GenerateUUID() {
        const hex = this.GenerateHex();
        // Format the UUID segments and join them with hyphens
        const uuid = [
            hex.slice(0, 4).join(""),
            hex.slice(4, 6).join(""),
            hex.slice(6, 8).join(""),
            hex.slice(8, 10).join(""),
            hex.slice(10).join("")
        ].join("-");
        return uuid.toUpperCase();
    }
}

const Utils = {
    General: new UtilsGeneral()
};

class Object3D extends EventDispatcher {
    #uuid;
    constructor() {
        super();
        this.#initialParams();
    }
    #initialParams() {
        this.#uuid = Utils.General.GenerateUUID();
        console.log(111, this.#uuid);
    }
}

console.log("MiO-Engine | Enjoy Coding!");

export { GLTFLoader, Object3D, Renderer, WebGL2Renderer, WebGPURenderer };
//# sourceMappingURL=mio-engine.js.map
