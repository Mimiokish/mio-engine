import { Loader } from "./Loader";

export class ImageLoader extends Loader {
    constructor() {
        super();

        this.#initialParams();
    }

    #initialParams(): void {
        this.requestMode = "cors";
        this.requestCredentials = "same-origin";
    }

    public async load(url: string): Promise<ImageBitmap | boolean | Error> {
        try {
            const _url: string = this.resolveURL(url);

            const response: Response | Error = await this.fetch(_url);
            if (response instanceof Error || !response) {
                console.error(new Error("MiO Engine | ImageLoader - file load failed: unknown"));
                return Promise.resolve(false);
            }

            const blob: Blob = await response.blob();
            if (!blob) {
                console.error(new Error("MiO Engine | ImageLoader - file load failed: unknown"));
                return Promise.resolve(false);
            } else {
                const imageData: ImageBitmap = await createImageBitmap(blob);

                return Promise.resolve(imageData);
            }

        } catch (error) {
            console.error(new Error("MiO Engine | ImageLoader - file load failed: " + error));
            return Promise.resolve(false);
        }
    }
}
