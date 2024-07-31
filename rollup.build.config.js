import plugin_resolve from "@rollup/plugin-node-resolve";
import plugin_babel from "@rollup/plugin-babel";
import plugin_typescript from "@rollup/plugin-typescript";
import plugin_eslint from "@rollup/plugin-eslint";
import plugin_terser from "@rollup/plugin-terser";

const cfg = {
    input: "src/index.ts",
    plugins: [
        plugin_resolve(),
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
        })
    ]
};

export default [
    {
        input: cfg.input,
        output: {
            name: "MiO-Engine",
            file: "build/mio-engine.js",
            format: "umd"
        },
        plugins: cfg.plugins
    },
    {
        input: cfg.input,
        output: {
            name: "MiO-Engine",
            file: "build/mio-engine.min.js",
            format: "umd"
        },
        plugins: [
            ...cfg.plugins,
            plugin_terser()
        ]
    },
    {
        input: cfg.input,
        output: {
            name: "MiO-Engine",
            file: "build/mio-engine.module.js",
            format: "es"
        },
        plugins: cfg.plugins
    }
];
