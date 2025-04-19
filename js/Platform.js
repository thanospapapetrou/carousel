'use strict';

class Platform extends Renderable {
    constructor(gl, attributes) {
        super(gl, attributes, {
            positions: [
                0.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                0.0, 0.0, 1.0
            ],
            normals: [
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0
            ],
            colors: [
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0
            ],
            indices: [
                0, 2, 1
            ]
        });
    }
}
