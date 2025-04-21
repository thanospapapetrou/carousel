'use strict';

class Sausage extends AbstractRenderable {
    constructor(gl, renderer, length, radius, sectors, slices, color) {
        super(gl, renderer, (() => {
            // back center
            const positions = [0.0, 0.0, 0.0];
            const normals = [0.0, 0.0, -1.0];
            const colors = [1.0, 0.0, 0.0, 1.0];
            const indices = [];
            const n = slices;
            for (let i = 0; i < sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / sectors;
                for (let j = 0; j < slices; j++) {
                    const sliceAngle = (j + 1) * Math.PI / 2 / slices;
                    const normalX = Math.sin(sliceAngle) * Math.cos(sectorAngle);
                    const normalY = Math.sin(sliceAngle) * Math.sin(sectorAngle);
                    const normalZ = Math.cos(sliceAngle);
                    const x = normalX * radius;
                    const y = normalY * radius;
                    const z = (1 - normalZ) * radius;
                    const next = (i + 1) % sectors;
                    positions.push(x, y, z);
                    normals.push(normalX, normalY, normalZ);
                    colors.push(...color);
                    if (j > 0) {
                        indices.push(next * n + j, next * n + + j + 1, i * n + j + 1);
                        indices.push(i * n + j + 1, i * n + j, next * n + j);
                    } else {
                        indices.push(0, next * n + 1, i * n + 1);
                    }
                }
                // 3 4 2 1
                // 3 4 2
                // 2 1 3
                const normalX = Math.cos(sectorAngle);
                const normalY = Math.sin(sectorAngle);
                const x = normalX * radius;
                const y = normalY * radius;
                const next = (i + 1) % sectors;
//                // back
//                positions.push(x, y, 0.0);
//                normals.push(0.0, 0.0, -1.0);
//                colors.push(...color);
//                indices.push(0, next * n + 1, i * n + 1);
//                // side
//                positions.push(x, y, 0.0);
//                positions.push(x, y, length);
//                normals.push(normalX, normalY, 0.0);
//                normals.push(normalX, normalY, 0.0);
//                colors.push(...color);
//                colors.push(...color);
//                indices.push(i * n + 2, next * n + 2, next * n + 3);
//                indices.push(next * n + 3, i * n + 3, i * n + 2);
//                // front
//                positions.push(x, y, length);
//                normals.push(0.0, 0.0, 1.0);
//                colors.push(...color);
//                indices.push(i * n + 4, next * n + 4, sectors * n + 1);
            }
//            // front center
//            positions.push(0.0, 0.0, length);
//            normals.push(0.0, 0.0, 1.0);
//            colors.push(...color);
            return {positions, normals, colors, indices};
        })());
    }
}
