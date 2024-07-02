import plugin_babel from "@rollup/plugin-babel";
import plugin_typescript from "@rollup/plugin-typescript";
import plugin_eslint from "@rollup/plugin-eslint";
import plugin_wgsl from "./loader-wgsl.js";
import plugin_serve from "rollup-plugin-serve";

export default {
    input: "src/index.ts",
    output: {
        name: "MiO-Engine",
        file: "static/mio-engine.js",
        format: "es",
        sourcemap: true
    },
    plugins: [
        plugin_typescript({
            tsconfig: "tsconfig.json"
        }),
        plugin_eslint({
            include: ["src/**/*.ts"],
            exclude: [
                "node_modules/**",
                "dev/**"
            ]
        }),
        plugin_babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled"
        }),
        plugin_wgsl(),
        plugin_serve({
            contentBase: "static",
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            mimeTypes: {
                "application/javascript": ["js_commonjs-proxy"]
            },
            onListening: function (server) {
                const address = server.address();
                const host = address.address === "::" ? "localhost" : address.address;

                // by using a bound function, we can access options as `this`
                const protocol = this.https ? "https" : "http";
                console.log(`Server listening at ${protocol}://${host}:${address.port}/`);
            }
        })
    ]
};
