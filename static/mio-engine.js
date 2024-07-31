class HTML {
    #self;
    get self() {
        return this.#self;
    }
    set self(value) {
        throw new Error("MiO Engine | node is readonly");
    }
    constructor(tagName) {
        this.#initialParams(tagName);
    }
    #initialParams(tagName) {
        const _tagName = tagName;
        if (!_tagName) {
            this.#self = document.createElement("div");
        }
        else {
            switch (_tagName) {
                case "canvas":
                    this.#self = document.createElement("canvas");
                    break;
                case "div":
                    this.#self = document.createElement("div");
                    break;
                default:
                    this.#self = document.createElement("div");
            }
        }
    }
    async appendToBody() {
        try {
            if (!this.#self) {
                console.log("MiO Engine | node is not found");
                return Promise.resolve(false);
            }
            if (document.readyState === "complete") {
                document.body.appendChild(this.#self);
                return Promise.resolve(true);
            }
            else {
                return new Promise((resolve) => {
                    const eventFn = () => {
                        document.body.appendChild(this.#self);
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
            if (!this.#self) {
                console.log("MiO Engine | node is not found");
                return Promise.resolve(false);
            }
            if (document.readyState === "complete") {
                const nodeParent = document.getElementById(_nodeId);
                if (!nodeParent) {
                    console.log("MiO Engine | parent node with id " + _nodeId + " is not found");
                    return Promise.resolve(false);
                }
                nodeParent.appendChild(this.#self);
                return Promise.resolve(true);
            }
            else {
                return new Promise((resolve) => {
                    const eventFn = () => {
                        if (this.#self) {
                            const nodeParent = document.getElementById(_nodeId);
                            if (!nodeParent) {
                                console.log("MiO Engine | parent node with id " + _nodeId + " is not found");
                                resolve(false);
                            }
                            else {
                                nodeParent.appendChild(this.#self);
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

class WebGPUCanvas extends HTML {
    get self() {
        return super.self;
    }
    set self(value) {
        throw new Error("MiO Engine | WebGPUCanvas - node is readonly");
    }
    get context() {
        return this.self.getContext("webgpu");
    }
    set context(value) {
        throw new Error("MiO Engine | WebGPUCanvas - context is readonly");
    }
    constructor() {
        super("canvas");
    }
    resize(width, height) {
        this.self.width = width;
        this.self.height = height;
    }
}

class Renderer {
    #node;
    #canvas;
    get canvas() {
        return this.#canvas;
    }
    set canvas(value) {
        throw Error("MiO-Engine | Renderer - canvas is readonly");
    }
    get context() {
        return this.#canvas.context;
    }
    set context(value) {
        throw Error("MiO-Engine | Renderer - context is readonly");
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
        switch (_contentType) {
            case "WebGPU":
            case "webgpu":
                this.#canvas = new WebGPUCanvas();
                break;
            default:
                this.#canvas = new WebGPUCanvas();
        }
        this.#node.appendChild(this.#canvas.self);
        return true;
    }
    resize(width, height) {
        this.#canvas.resize(width, height);
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

class ImageLoader extends Loader {
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
                console.error(new Error("MiO Engine | ImageLoader - file load failed: unknown"));
                return Promise.resolve(false);
            }
            const blob = await response.blob();
            if (!blob) {
                console.error(new Error("MiO Engine | ImageLoader - file load failed: unknown"));
                return Promise.resolve(false);
            }
            else {
                const imageData = await createImageBitmap(blob);
                return Promise.resolve(imageData);
            }
        }
        catch (error) {
            console.error(new Error("MiO Engine | ImageLoader - file load failed: " + error));
            return Promise.resolve(false);
        }
    }
}

class Material {
    #device;
    #imageLoader;
    #texture;
    #textureView;
    #sampler;
    constructor(params) {
        this.#initialParams(params);
    }
    #initialParams(params) {
        const _params = params;
        if (_params.device) {
            this.#device = _params.device;
        }
        this.#imageLoader = new ImageLoader();
    }
    create() {
        const textureViewDescriptor = {
            format: "rgba8unorm",
            dimension: "2d",
            aspect: "all",
            baseMipLevel: 0,
            mipLevelCount: 1,
            baseArrayLayer: 0,
            arrayLayerCount: 1
        };
        this.#textureView = this.#texture.createView(textureViewDescriptor);
        const samplerDescriptor = {
            addressModeU: "repeat",
            addressModeV: "repeat",
            magFilter: "linear",
            minFilter: "nearest",
            mipmapFilter: "nearest",
            maxAnisotropy: 1
        };
        this.#sampler = this.#device.createSampler(samplerDescriptor);
    }
    async load(url) {
        const _url = url;
        if (!_url) {
            return;
        }
        else {
            const imageBitmap = await this.#imageLoader.load(_url);
            const textureDescriptor = {
                size: {
                    width: imageBitmap.width,
                    height: imageBitmap.height
                },
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
            };
            this.#texture = this.#device.createTexture(textureDescriptor);
            this.#device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: this.#texture }, textureDescriptor.size);
        }
    }
}

var TriangleWGSL = "struct Transform {\r\n    model: mat4x4<f32>,\r\n    view: mat4x4<f32>,\r\n    projection: mat4x4<f32>\r\n};\r\n@binding(0) @group(0) var<uniform> transformUBO: Transform;\r\n\r\nstruct Fragment {\r\n    @builtin(position) Position : vec4<f32>,\r\n    @location(0) Color : vec4<f32>\r\n};\r\n\r\n@vertex\r\nfn vs_main(@location(0) vertexPostion: vec3<f32>, @location(1) vertexColor: vec3<f32>) -> Fragment {\r\n    var output : Fragment;\r\n    output.Position = transformUBO.projection * transformUBO.view * transformUBO.model * vec4<f32>(vertexPostion, 1.0);\r\n    output.Color = vec4<f32>(vertexColor, 1.0);\r\n\r\n    return output;\r\n};\r\n\r\n@fragment\r\nfn fs_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {\r\n    return Color;\r\n}\r\n";

class Mesh {
    #vertices;
    #webGpuDevice;
    #webGpuBuffer;
    #webGpuBufferLayout;
    #webGpuBufferUsage;
    #webGpuBufferDescriptor;
    get vertices() {
        return this.#vertices;
    }
    set vertices(value) {
        this.#vertices = value;
    }
    get buffer() {
        return this.#webGpuBuffer;
    }
    set buffer(value) {
        this.#webGpuBuffer = value;
    }
    get bufferLayout() {
        return this.#webGpuBufferLayout;
    }
    set bufferLayout(value) {
        this.#webGpuBufferLayout = value;
    }
    get bufferDescriptor() {
        return this.#webGpuBufferDescriptor;
    }
    set bufferDescriptor(value) {
        this.#webGpuBufferDescriptor = value;
    }
    constructor(params) {
        const _params = params;
        if (!_params || JSON.stringify(_params) == "{}") {
            console.warn("MiO-Engine | Mesh - params is missing");
        }
        else {
            this.#initialParams(params);
        }
    }
    #initialParams(params) {
        const _params = params;
        if (_params.device) {
            this.#webGpuDevice = _params.device;
        }
        this.#webGpuBufferUsage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
    }
    createBuffer() {
        if (!this.#webGpuDevice) {
            console.warn("MiO-Engine | Mesh - webGpuDevice is missing while creating a buffer");
            return;
        }
        else {
            this.#webGpuBufferDescriptor = {
                size: this.#vertices.byteLength,
                usage: this.#webGpuBufferUsage,
                mappedAtCreation: true
            };
            this.#webGpuBuffer = this.#webGpuDevice.createBuffer(this.#webGpuBufferDescriptor);
            new Float32Array(this.#webGpuBuffer.getMappedRange()).set(this.#vertices);
            this.#webGpuBuffer.unmap();
        }
    }
}

class TriangleMesh extends Mesh {
    constructor(params) {
        super(params);
        this.#initialParams();
    }
    #initialParams() {
        this.vertices = new Float32Array([
            0.0, 0.0, 0.5, 1.0, 0.0, 0.0,
            0.0, -0.5, -0.5, 0.0, 1.0, 0.0,
            0.0, 0.5, -0.5, 0.0, 0.0, 1.0
        ]);
        super.createBuffer();
        this.bufferLayout = {
            arrayStride: 24,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: "float32x3"
                },
                {
                    shaderLocation: 1,
                    offset: 12,
                    format: "float32x3"
                }
            ]
        };
    }
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

/**
 * @public
 * @class
 */
class WebGPURenderer extends Renderer {
    #webGpu;
    #webGpuAdapter;
    #webGpuDevice;
    #webGpuFormat;
    #material;
    #uniformBuffer;
    #bindGroup;
    #pipeline;
    #triangleMesh;
    #temp;
    get device() {
        return this.#webGpuDevice;
    }
    set device(value) {
        throw Error("MiO-Engine | WebGPURenderer - device is readonly");
    }
    constructor() {
        super({
            contextType: "WebGPU"
        });
    }
    async initialize() {
        const resultParams = await this.#initialParams();
        if (!resultParams) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }
    async #initialParams() {
        this.#webGpu = navigator.gpu;
        if (!this.#webGpu) {
            console.error("MiO-Engine | WebGPURenderer - WebGPU is not supported");
            return Promise.resolve(false);
        }
        this.#webGpuAdapter = await this.#webGpu.requestAdapter();
        if (!this.#webGpuAdapter) {
            console.error("MiO-Engine | WebGPURenderer - WebGPUAdapter initial failed");
            return Promise.resolve(false);
        }
        this.#webGpuDevice = await this.#webGpuAdapter.requestDevice();
        if (!this.#webGpuDevice) {
            console.error("MiO-Engine | WebGPURenderer - a browser that supports WebGPU is needed");
            return Promise.resolve(false);
        }
        else {
            this.#material = new Material({
                device: this.#webGpuDevice
            });
        }
        this.#webGpuFormat = "rgba8unorm";
        this.context.configure({
            device: this.#webGpuDevice,
            format: this.#webGpuFormat,
            alphaMode: "opaque"
        });
        return Promise.resolve(true);
    }
    async createAssets() {
        this.#triangleMesh = new TriangleMesh({
            device: this.#webGpuDevice
        });
        this.#temp = 0.0;
        // await this.#material.load("http://127.0.0.1:8080/cdn/img/maine_coon.jpg");
        // this.#material.create();
    }
    createPipeline() {
        this.#uniformBuffer = this.#webGpuDevice.createBuffer({
            size: 64 * 3,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        const bindGroupLayout = this.#webGpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {}
                }
            ],
        });
        this.#bindGroup = this.#webGpuDevice.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#uniformBuffer
                    }
                }
            ]
        });
        const pipelineLayout = this.#webGpuDevice.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });
        this.#pipeline = this.#webGpuDevice.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: this.#webGpuDevice.createShaderModule({
                    code: TriangleWGSL
                }),
                entryPoint: "vs_main",
                buffers: [
                    this.#triangleMesh.bufferLayout
                ]
            },
            fragment: {
                module: this.#webGpuDevice.createShaderModule({
                    code: TriangleWGSL
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
    }
    async render() {
        this.drawTriangle();
    }
    drawTriangle = () => {
        this.#temp += 0.01;
        if (this.#temp > 2.0 * Math.PI) {
            this.#temp -= 2.0 * Math.PI;
        }
        const projection = create();
        perspective(projection, Math.PI / 4, 800 / 600, 0.1, 10);
        const view = create();
        lookAt(view, [-2, 0, 2], [0, 0, 0], [0, 0, 1]);
        const model = create();
        rotate(model, model, this.#temp, [0, 0, 1]);
        this.#webGpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, model);
        this.#webGpuDevice.queue.writeBuffer(this.#uniformBuffer, 64, view);
        this.#webGpuDevice.queue.writeBuffer(this.#uniformBuffer, 128, projection);
        const commandEncoder = this.#webGpuDevice.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                    view: textureView,
                    clearValue: {
                        r: 1.0,
                        g: 1.0,
                        b: 1.0,
                        a: 1.0
                    },
                    loadOp: "clear",
                    storeOp: "store"
                }]
        });
        renderPass.setPipeline(this.#pipeline);
        renderPass.setVertexBuffer(0, this.#triangleMesh.buffer);
        renderPass.setBindGroup(0, this.#bindGroup);
        renderPass.draw(3, 1, 0, 0);
        renderPass.end();
        this.#webGpuDevice.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(this.drawTriangle);
    };
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
        this.target = new WebGPUCanvas();
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

export { GLTFLoader, Material, Object3D, Renderer, WebGL2Renderer, WebGPURenderer };
//# sourceMappingURL=mio-engine.js.map
