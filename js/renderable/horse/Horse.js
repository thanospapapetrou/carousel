'use strict';

class Horse {
    #body;
    #neck;

    constructor(gl, renderer) {
        this.#body = new Body(gl, renderer);
        this.#neck = new Neck(gl, renderer);
    }

    render(parent, angle, phase) {
        const model = this.#model(parent, angle, phase);
        this.#body.render(model);
        this.#neck.render(model);
    }

    #model(parent, angle, phase) {
        const model = mat4.create();
        mat4.multiply(model, model, parent);
        mat4.rotateY(model, model, angle);
        mat4.translate(model, model, [Configuration.poles.distance,
            1.0 + Math.sin(phase + Configuration.horse.frequency * angle), 0.0]); // TODO
        mat4.rotateY(model, model, Math.PI);
        return model;
    }
}
