'use strict';

class Platform extends Renderable {
    constructor(gl, attributes) {
        super(gl, attributes, (() => {
            const positions = [0.0, 0.0, 0.0];
            const normals = [0.0, -1.0, 0.0];
            const colors = [...Configuration.platform.base.color];
            const indices = [];
            const n = 11;
            for (let i = 0; i < Configuration.platform.sectors; i++) {
                const sectorAngle = i * 2 * Math.PI / Configuration.platform.sectors;
                const normalX = Math.cos(sectorAngle);
                const normalZ = Math.sin(sectorAngle);
                const baseX = normalX * Configuration.platform.base.radius;
                const baseY = Configuration.platform.base.height;
                const baseZ = normalZ * Configuration.platform.base.radius;
                const poleX = normalX * Configuration.platform.pole.radius;
                const poleY = baseY + Configuration.platform.pole.height;
                const poleZ = normalZ * Configuration.platform.pole.radius;
                const roofX = normalX * Configuration.platform.roof.radius;
                const roofY = poleY + Configuration.platform.roof.height;
                const roofZ = normalZ * Configuration.platform.roof.radius;
                const roofAngle = Math.atan(Configuration.platform.roof.height / Configuration.platform.roof.radius);
                const roofNormalXZ = Math.sin(roofAngle);
                const roofNormalX = normalX * roofNormalXZ;
                const roofNormalY = Math.cos(roofAngle);
                const roofNormalZ = normalZ * roofNormalXZ;
                const next = (i + 1) % Configuration.platform.sectors;
                // base bottom
                positions.push(baseX, 0.0, baseZ);
                normals.push(0.0, -1.0, 0.0);
                colors.push(...Configuration.platform.base.color);
                indices.push(i * n + 1, next * n + 1, 0);
                // base side
                positions.push(baseX, 0.0, baseZ);
                positions.push(baseX, baseY, baseZ);
                normals.push(normalX, 0.0, normalZ);
                normals.push(normalX, 0.0, normalZ);
                colors.push(...Configuration.platform.base.color);
                colors.push(...Configuration.platform.base.color);
                indices.push(i * n + 2, i * n + 3, next * n + 3);
                indices.push(next * n + 3, next * n + 2, i * n + 2);
                // base top
                positions.push(baseX, baseY, baseZ);
                positions.push(poleX, baseY, poleZ);
                normals.push(0.0, 1.0, 0.0);
                normals.push(0.0, 1.0, 0.0);
                colors.push(...Configuration.platform.base.color);
                colors.push(...Configuration.platform.base.color);
                indices.push(i * n + 4, i * n + 5, next * n + 5);
                indices.push(next * n + 5, next * n + 4, i * n + 4);
                // pole
                positions.push(poleX, baseY, poleZ);
                positions.push(poleX, poleY, poleZ);
                normals.push(normalX, 0.0, normalZ);
                normals.push(normalX, 0.0, normalZ);
                colors.push(...Configuration.platform.pole.color);
                colors.push(...Configuration.platform.pole.color);
                indices.push(i * n + 6, i * n + 7, next * n + 7);
                indices.push(next * n + 7, next * n + 6, i * n + 6);
                // roof bottom
                positions.push(poleX, poleY, poleZ);
                positions.push(roofX, poleY, roofZ);
                normals.push(0.0, -1.0, 0.0);
                normals.push(0.0, -1.0, 0.0);
                colors.push(...Configuration.platform.roof.bottom);
                colors.push(...Configuration.platform.roof.bottom);
                indices.push(i * n + 8, i * n + 9, next * n + 9);
                indices.push(next * n + 9, next * n + 8, i * n + 8);
                // roof top
                positions.push(roofX, poleY, roofZ);
                positions.push(0.0, roofY, 0.0);
                normals.push(roofNormalX, roofNormalY, roofNormalY);
                normals.push(roofNormalX, roofNormalY, roofNormalY);
                colors.push(...Configuration.platform.roof.top);
                colors.push(...Configuration.platform.roof.top);
                indices.push(i * n + 10, i * n + 11, next * n + 11);
                indices.push(next * n + 11, next * n + 10, i * n + 10);
            }
            return {positions, normals, colors, indices};
        })());
    }
}
