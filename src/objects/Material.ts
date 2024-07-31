import {MaterialParameters, WebGPUDevice, Texture, TextureView, Sampler, TextureDescriptor} from "../declaration";
import { ImageLoader } from "../loaders/ImageLoader";

export class Material {
    #device: WebGPUDevice;
    #imageLoader: ImageLoader;
    #texture: Texture;
    #textureView: TextureView;
    #sampler: Sampler;

    constructor(params: MaterialParameters) {
        this.#initialParams(params);
    }

    #initialParams(params: MaterialParameters) {
        const _params: MaterialParameters = params;

        if (_params.device) {
            this.#device = _params.device;
        }

        this.#imageLoader = new ImageLoader();
    }

    public create() {
        const textureViewDescriptor: GPUTextureViewDescriptor = {
            format: "rgba8unorm",
            dimension: "2d",
            aspect: "all",
            baseMipLevel: 0,
            mipLevelCount: 1,
            baseArrayLayer: 0,
            arrayLayerCount: 1
        };
        this.#textureView = this.#texture.createView(textureViewDescriptor);

        const samplerDescriptor: GPUSamplerDescriptor = {
            addressModeU: "repeat",
            addressModeV: "repeat",
            magFilter: "linear",
            minFilter: "nearest",
            mipmapFilter: "nearest",
            maxAnisotropy: 1
        };
        this.#sampler = this.#device.createSampler(samplerDescriptor);
    }

    public async load(url: string) {
        const _url: string = url;

        if (!_url) {
            return;
        } else {
            const imageBitmap = await this.#imageLoader.load(_url) as ImageBitmap;

            const textureDescriptor: GPUTextureDescriptor = {
                size: {
                    width: imageBitmap.width,
                    height: imageBitmap.height
                },
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
            };

            this.#texture = this.#device.createTexture(textureDescriptor);
            this.#device.queue.copyExternalImageToTexture({ source: imageBitmap}, { texture: this.#texture }, textureDescriptor.size);
        }
    }
}
