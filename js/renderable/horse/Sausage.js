'use strict';

class Sausage extends AbstractRenderable {
    constructor(gl, renderer, length, radius, sectors, slices, color) {
        super(gl, renderer, (() => {
            // back center
            const positions = [0.0, 0.0, -radius];
            const normals = [0.0, 0.0, -1.0];
            const colors = [...color];
            const indices = [];
            const n = 2 * slices;
            for (let i = 0; i < sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / sectors;
                const next = (i + 1) % sectors;
                // back
                for (let j = 0; j < slices; j++) {
                    const sliceAngle = Math.PI - (j + 1) / slices * Math.PI / 2;
                    const normalX = Math.sin(sliceAngle) * Math.cos(sectorAngle);
                    const normalY = Math.sin(sliceAngle) * Math.sin(sectorAngle);
                    const normalZ = Math.cos(sliceAngle);
                    const x = normalX * radius;
                    const y = normalY * radius;
                    const z = normalZ * radius;
                    positions.push(x, y, z);
                    normals.push(normalX, normalY, normalZ);
                    colors.push(...color);
                    if (j > 0) {
                        indices.push(next * n + j, next * n + j + 1, i * n + j + 1);
                        indices.push(i * n + j + 1, i * n + j, next * n + j);
                    } else {
                        indices.push(0, next * n + 1, i * n + 1);
                    }
                }
                // middle and front
                for (let j = 0; j < slices; j++) {
                    const sliceAngle = Math.PI / 2 - j / slices * Math.PI / 2;
                    const normalX = Math.sin(sliceAngle) * Math.cos(sectorAngle);
                    const normalY = Math.sin(sliceAngle) * Math.sin(sectorAngle);
                    const normalZ = Math.cos(sliceAngle);
                    const x = normalX * radius;
                    const y = normalY * radius;
                    const z = length + normalZ * radius;
                    positions.push(x, y, z);
                    normals.push(normalX, normalY, normalZ);
                    colors.push(...color);
                    indices.push(next * n + slices + j, next * n + + slices + j + 1, i * n + slices + j + 1);
                    indices.push(i * n + slices + j + 1, i * n + slices + j, next * n + slices + j);
                }
                indices.push(next * n + 2 * slices, sectors  * 2 * slices + 1, i * n + 2 * slices);
            }
            // front center
            positions.push(0.0, 0.0, length + radius);
            normals.push(0.0, 0.0, 1.0);
            colors.push(...color);
            return {positions, normals, colors, indices};
        })());
    }
}
