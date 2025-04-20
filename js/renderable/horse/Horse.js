'use strict';

class Horse {
    #body;
    #neck;

    constructor(gl, renderer) {
        this.#body = new Body(gl, renderer);
        this.#neck = new Neck(gl, renderer);
    }

    render(parent, i, rotation) {
        const model = this.#model(parent, i, rotation);
        this.#body.render(model);
        this.#neck.render(model);
    }

    #model(parent, i, rotation) {
        const angle = i * 2 * Math.PI / Configuration.platform.poles;
        const model = mat4.create();
        mat4.multiply(model, model, parent);
        mat4.rotateY(model, model, angle);
        mat4.translate(model, model, [Configuration.poles.distance,
            1.0 + Math.sin(rotation + Configuration.horse.frequency * angle), 0.0]); // TODO
        mat4.rotateY(model, model, Math.PI);
        return model;
    }
}
