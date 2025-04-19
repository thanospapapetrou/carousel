'use strict';

class Platform extends Renderable {
    constructor(gl, attributes) {
        super(gl, attributes, (() => {
            const positions = [0.0, 0.0, 0.0];
            const normals = [0.0, -1.0, 0.0];
            const colors = [1.0, 0.0, 0.0, 1.0];
            const indices = [];
            for (let i = 0; i < Configuration.platform.sectors; i++) {
                const a = i * 2 * Math.PI / Configuration.platform.sectors;
                const x = Math.cos(a);
                const z = Math.sin(a);
                positions.push(x * Configuration.platform.base.radius, 0.0, z * Configuration.platform.base.radius);
                normals.push(0.0, -1.0, 0.0);
                colors.push(1.0, 0.0, 0.0, 1.0);
                indices.push(i + 1, (i + 1) % Configuration.platform.sectors + 1, 0);
            }
            return {positions, normals, colors, indices};
        })());
    }
}
