class Renderer {
    #renderPass;
    get renderPass() {
        return this.#renderPass;
    }
    set renderPass(value) {
        throw Error("MiO-Engine | renderPass is readonly");
    }
    constructor(params) {
        this.#initialParams(params);
    }
    #initialParams(params) {
        const _contentType = params.contextType ? params.contextType : "WebGPU";
        switch (_contentType) {
            case "WebGPU":
            case "webgpu":
                this.#renderPass = new WebGPURenderPass();
                break;
            default:
                this.#renderPass = new WebGPURenderPass();
        }
    }
}

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

class RendererPass {
    #node;
    #canvas;
    #context;
    get node() {
        return this.#node;
    }
    set node(value) {
        throw Error("MiO-Engine | node is readonly");
    }
    get canvas() {
        return this.#canvas;
    }
    set canvas(value) {
        throw Error("MiO-Engine | canvas is readonly");
    }
    get context() {
        return this.#context;
    }
    set context(value) {
        throw Error("MiO-Engine | context is readonly");
    }
    constructor(params) {
        this.#initialParams(params);
    }
    #initialParams(params) {
        const _contextType = params.contextType ? params.contextType : "WebGPU";
        this.#node = document.getElementById("MiO-Engine");
        if (!this.#node) {
            console.error("MiO-Engine | a node with the ID(MiO-Engine) needs to be create before render");
            return false;
        }
        this.#canvas = new Canvas();
        this.#node.appendChild(this.#canvas.node);
        // set context
        switch (_contextType) {
            case "WebGPU":
            case "webgpu":
                this.#context = this.#canvas.getContext("webgpu");
                break;
            default:
                this.#context = this.#canvas.getContext("webgpu");
        }
    }
}

class WebGPURenderer extends Renderer {
    constructor() {
        super({
            contextType: "WebGPU"
        });
        this.#initialParams();
    }
    #initialParams() {
    }
}

class WebGPURenderPass extends RendererPass {
    #webGpu;
    #webGpuAdapter;
    #webGpuDevice;
    #webGpuContext;
    #webGpuFormat;
    constructor() {
        super({
            contextType: "WebGPU"
        });
        this.#initialParams().then((res) => {
            if (res) {
                console.log("MiO-Engine | engine is ready to go, enjoy coding~");
                const size = 4 * 4 + 2 * 4 + 2 * 4;
                this.#webGpuDevice.createBuffer({
                    size: size,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });
            }
        });
    }
    async #initialParams() {
        this.#webGpu = navigator.gpu;
        if (!this.#webGpu) {
            console.error("MiO-Engine | WebGPU is not supported");
            return false;
        }
        this.#webGpuAdapter = await this.#webGpu.requestAdapter();
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | WebGPUAdapter initial failed");
            return false;
        }
        this.#webGpuDevice = await this.#webGpuAdapter.requestDevice();
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | a browser that supports WebGPU is needed");
            return false;
        }
        this.#webGpuContext = this.context;
        try {
            this.#webGpuContext.configure({
                device: this.#webGpuDevice,
                format: navigator.gpu.getPreferredCanvasFormat()
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
        if (!_code || _code === "") {
            console.warn("MiO Engine | engine is creating an empty shader due to a missing parameter: code");
            return false;
        }
        const shaderModule = this.#webGpuDevice.createShaderModule({
            label: _label,
            code: _code
        });
        return shaderModule;
    }
    createRenderPipeline(descriptor) { }
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
