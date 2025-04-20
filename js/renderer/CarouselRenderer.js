'use strict';

class CarouselRenderer extends AbstractRenderer {
    static UNIFORM_CAMERA = 'camera';
    static UNIFORM_LIGHT_AMBIENT = 'light.ambient';
    static UNIFORM_LIGHT_DIRECTIONAL_COLOR = 'light.directional.color';
    static UNIFORM_LIGHT_DIRECTIONAL_DIRECTION = 'light.directional.direction';
    static UNIFORM_MODEL = 'model';
    static UNIFORM_PROJECTION = 'projection';

    static #SHADER_FRAGMENT = './glsl/carousel.frag';
    static #SHADER_VERTEX = './glsl/carousel.vert';

    constructor(gl, attributes) {
        super(gl, CarouselRenderer.#SHADER_VERTEX, CarouselRenderer.#SHADER_FRAGMENT,
                [CarouselRenderer.UNIFORM_PROJECTION, CarouselRenderer.UNIFORM_CAMERA, CarouselRenderer.UNIFORM_MODEL,
                CarouselRenderer.UNIFORM_LIGHT_AMBIENT, CarouselRenderer.UNIFORM_LIGHT_DIRECTIONAL_COLOR,
                CarouselRenderer.UNIFORM_LIGHT_DIRECTIONAL_DIRECTION], attributes); // TODO hardcode attributes
    }
}
