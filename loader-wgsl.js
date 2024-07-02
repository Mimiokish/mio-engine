import fs from "fs";
import path from "path";

export default function loaderWgsl() {
    return {
        name: "wgsl-loader",
        transform(code, id) {
            if (id.endsWith(".wgsl")) {
                const content = fs.readFileSync(id, "utf8");
                return {
                    code: `export default ${JSON.stringify(content)};`,
                    map: {
                        mappings: ""
                    }
                };
            }
        }
    };
}
