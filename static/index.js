import * as MiOEngine from "./mio-engine.js";
// console.log(111, MiOEngine);

const renderer = new MiOEngine.WebGPURenderer();
renderer.initialize().then((res) => {
    if (res) {
        // webGpuRenderer.createAssets();
        renderer.createAssets().then(() => {
            renderer.createPipeline();

            renderer.render();
        });
    }
});

// const gltfLoader = new MiOEngine.GLTFLoader();
// // console.log(333, gltfLoader);
//
// // gltfLoader.load("");
// gltfLoader.load("/cdn/gltf/box/box.gltf")
//     .then((gltf) => {
//         // console.log(545, gltf);
//     });
//
// const object3D = new MiOEngine.Object3D();
// console.log(3434, object3D);
