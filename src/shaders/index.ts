// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import triangle from "./libs/triangle.wgsl";
import vertex from "./libs/vertex.wgsl";
import fragment from "./libs/fragment.wgsl";

export const libs = {
    triangle: triangle,
    vertex: vertex,
    fragment: fragment
};
