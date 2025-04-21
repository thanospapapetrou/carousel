'use strict';

class Horse {
    #body;
    #neck;
    #head;

    constructor(gl, renderer) {
        this.#body = new Body(gl, renderer);
        this.#neck = new Neck(gl, renderer);
        this.#head = new Head(gl, renderer);
    }

    render(parent, angle, phase) {
        const model = this.#model(parent, angle, phase);
        this.#body.render(model);
        this.#neck.render(model);
        this.#head.render(model);
    }

    #model(parent, angle, phase) {
        const model = mat4.create();
        mat4.multiply(model, model, parent);
        mat4.rotateY(model, model, angle);
        mat4.translate(model, model, [Configuration.poles.distance,
            1.0 + Math.sin(phase), 0.0]); // TODO
        mat4.rotateY(model, model, Math.PI);
        return model;
    }
}
