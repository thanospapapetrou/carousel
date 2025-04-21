'use strict';

class Head extends AbstractRenderable {
    constructor(gl, renderer) {
        super(gl, renderer, (() => {
            // back center
            const positions = [0.0, 0.0, 0.0];
            const normals = [0.0, 0.0, -1.0];
            const colors = [...Configuration.horse.color];
            const indices = [];
            const n = 4;
            for (let i = 0; i < Configuration.horse.head.sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / Configuration.horse.head.sectors;
                const normalX = Math.cos(sectorAngle);
                const normalY = Math.sin(sectorAngle);
                const x = normalX * Configuration.horse.head.radius;
                const y = normalY * Configuration.horse.head.radius;
                const next = (i + 1) % Configuration.horse.head.sectors;
                // back
                positions.push(x, y, 0.0);
                normals.push(0.0, 0.0, -1.0);
                colors.push(...Configuration.horse.color);
                indices.push(0, next * n + 1, i * n + 1);
                // side
                positions.push(x, y, 0.0);
                positions.push(x, y, Configuration.horse.head.length);
                normals.push(normalX, normalY, 0.0);
                normals.push(normalX, normalY, 0.0);
                colors.push(...Configuration.horse.color);
                colors.push(...Configuration.horse.color);
                indices.push(i * n + 2, next * n + 2, next * n + 3);
                indices.push(next * n + 3, i * n + 3, i * n + 2);
                // front
                positions.push(x, y, Configuration.horse.head.length);
                normals.push(0.0, 0.0, 1.0);
                colors.push(...Configuration.horse.color);
                indices.push(i * n + 4, next * n + 4, Configuration.horse.head.sectors * n + 1);
            }
            // front center
            positions.push(0.0, 0.0, Configuration.horse.head.length);
            normals.push(0.0, 0.0, 1.0);
            colors.push(...Configuration.horse.color);
            return {positions, normals, colors, indices};
        })());
    }

    render(parent) {
        this._renderer.uniforms.model = this.#model(parent);
        super.render();
    }

    #model(parent) {
        const model = mat4.create();
        mat4.multiply(model, model, parent);
        mat4.translate(model, model, [0.0, Configuration.horse.neck.height, Configuration.horse.body.length / 2 - 2 * Configuration.horse.neck.radius]);
        return model;
    }
}
