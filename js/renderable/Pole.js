'use strict';

class Pole extends AbstractRenderable {
    constructor(gl, renderer) {
        super(gl, renderer, (() => {
            const positions = [];
            const normals = [];
            const colors = [];
            const indices = [];
            const n = 2;
            for (let i = 0; i < Configuration.poles.sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / Configuration.poles.sectors;
                const normalX = Math.cos(sectorAngle);
                const normalZ = Math.sin(sectorAngle);
                const x = normalX * Configuration.poles.radius;
                const y = Configuration.platform.pole.height;
                const z = normalZ * Configuration.poles.radius;
                const next = (i + 1) % Configuration.poles.sectors;
                // base side
                positions.push(x, 0.0, z);
                positions.push(x, y, z);
                normals.push(normalX, 0.0, normalZ);
                normals.push(normalX, 0.0, normalZ);
                colors.push(...Configuration.poles.color);
                colors.push(...Configuration.poles.color);
                indices.push(i * n, i * n + 1, next * n + 1);
                indices.push(next * n + 1, next * n, i * n);
            }
            return {positions, normals, colors, indices};
        })());
    }
}
