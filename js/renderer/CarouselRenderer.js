'use strict';

class CarouselRenderer extends Renderer {
    static UNIFORM_CAMERA = 'camera';
    static UNIFORM_LIGHT_AMBIENT = 'light.ambient';
    static UNIFORM_LIGHT_DIRECTIONAL_COLOR = 'light.directional.color';
    static UNIFORM_LIGHT_DIRECTIONAL_DIRECTION = 'light.directional.direction';
    static UNIFORM_MODEL = 'model';
    static UNIFORM_PROJECTION = 'projection';

    constructor(gl, vertex, fragment, attributes) {
        super(gl, vertex, fragment, [CarouselRenderer.UNIFORM_PROJECTION, CarouselRenderer.UNIFORM_CAMERA,
                CarouselRenderer.UNIFORM_MODEL, CarouselRenderer.UNIFORM_LIGHT_AMBIENT,
                CarouselRenderer.UNIFORM_LIGHT_DIRECTIONAL_COLOR,
                CarouselRenderer.UNIFORM_LIGHT_DIRECTIONAL_DIRECTION], attributes);
    }
}
