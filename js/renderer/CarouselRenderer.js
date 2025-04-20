'use strict';

class CarouselRenderer extends AbstractRenderer {
    static #SHADER_FRAGMENT = './glsl/carousel.frag';
    static #SHADER_VERTEX = './glsl/carousel.vert';

    constructor(gl, attributes) {
        super(gl, CarouselRenderer.#SHADER_VERTEX, CarouselRenderer.#SHADER_FRAGMENT, {
            projection: (gl, uniform, projection) => gl.uniformMatrix4fv(uniform, false, projection),
            camera: (gl, uniform, camera) => gl.uniformMatrix4fv(uniform, false, camera),
            model: (gl, uniform, model) => gl.uniformMatrix4fv(uniform, false, model),
            light: {
                ambient: (gl, uniform, color) => gl.uniform3fv(uniform, color),
                directional: {
                    color: (gl, uniform, color) => gl.uniform3fv(uniform, color),
                    direction: (gl, uniform, direction) => gl.uniform3fv(uniform, direction)
                }
            }
        }, attributes); // TODO hardcode attributes
    }
}
