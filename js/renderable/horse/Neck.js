'use strict';

class Neck extends AbstractRenderable {
    constructor(gl, attributes) {
        super(gl, attributes, (() => {
            const positions = [];
            const normals = [];
            const colors = [];
            const indices = [];
            const n = 2;
            for (let i = 0; i < Configuration.horse.neck.sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / Configuration.horse.neck.sectors;
                const normalX = Math.cos(sectorAngle);
                const normalZ = Math.sin(sectorAngle);
                const x = normalX * Configuration.horse.neck.radius;
                const y = Configuration.horse.neck.height;
                const z = normalZ * Configuration.horse.neck.radius;
                const next = (i + 1) % Configuration.horse.neck.sectors;
                // base side
                positions.push(x, 0.0, z);
                positions.push(x, y, z);
                normals.push(normalX, 0.0, normalZ);
                normals.push(normalX, 0.0, normalZ);
                colors.push(...Configuration.horse.color);
                colors.push(...Configuration.horse.color);
                indices.push(i * n, i * n + 1, next * n + 1);
                indices.push(next * n + 1, next * n, i * n);
            }
            return {positions, normals, colors, indices};
        })());
    }
}
