'use strict';

class Horse {
    #body;
    #neck;

    constructor(gl, attributes) {
        this.#body = new Body(gl, attributes);
        this.#neck = new Neck(gl, attributes);
    }

    render() {
        this.#body.render();
        this.#neck.render();
    }
}
