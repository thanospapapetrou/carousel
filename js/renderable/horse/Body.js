'use strict';

class Body extends AbstractRenderable {
    constructor(gl, renderer) {
        super(gl, renderer, (() => {
            // back center
            const positions = [0.0, 0.0, -Configuration.horse.body.length / 2];
            const normals = [0.0, 0.0, -1.0];
            const colors = [...Configuration.horse.color];
            const indices = [];
            const n = 4;
            for (let i = 0; i < Configuration.horse.body.sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / Configuration.horse.body.sectors;
                const normalX = Math.cos(sectorAngle);
                const normalY = Math.sin(sectorAngle);
                const x = normalX * Configuration.horse.body.radius;
                const y = normalY * Configuration.horse.body.radius;
                const next = (i + 1) % Configuration.horse.body.sectors;
                // back
                positions.push(x, y, -Configuration.horse.body.length / 2);
                normals.push(0.0, 0.0, -1.0);
                colors.push(...Configuration.horse.color);
                indices.push(0, next * n + 1, i * n + 1);
                // side
                positions.push(x, y, -Configuration.horse.body.length / 2);
                positions.push(x, y, Configuration.horse.body.length / 2);
                normals.push(normalX, normalY, 0.0);
                normals.push(normalX, normalY, 0.0);
                colors.push(...Configuration.horse.color);
                colors.push(...Configuration.horse.color);
                indices.push(i * n + 2, next * n + 2, next * n + 3);
                indices.push(next * n + 3, i * n + 3, i * n + 2);
                // front
                positions.push(x, y, Configuration.horse.body.length / 2);
                normals.push(0.0, 0.0, 1.0);
                colors.push(...Configuration.horse.color);
                indices.push(i * n + 4, next * n + 4, Configuration.horse.body.sectors * n + 1);
            }
            // front center
            positions.push(0.0, 0.0, Configuration.horse.body.length / 2);
            normals.push(0.0, 0.0, 1.0);
            colors.push(...Configuration.horse.color);
            return {positions, normals, colors, indices};
        })());
    }

    render(parent) {
        this._renderer.uniforms.model = parent;
        super.render();
    }
}
