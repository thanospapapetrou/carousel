'use strict';

class Carousel {
    static #ATTRIBUTES = ['position', 'normal', 'color'];
    static #CONTEXT = 'webgl2';
    static #FORMAT_ANGLE = (angle) => `${angle} rad (${angle * 180 / Math.PI} °)`;
    static #FORMAT_DISTANCE = (distance) => `${distance} m`;
    static #MS_PER_S = 1000;
    static #SELECTOR_AZIMUTH = 'span#azimuth';
    static #SELECTOR_CANVAS = 'canvas#carousel';
    static #SELECTOR_DISTANCE = 'span#distance';
    static #SELECTOR_ELEVATION = 'span#elevation';
    static #SELECTOR_FPS = 'span#fps';

    #gl;
    #renderer;
    #platform;
    #pole;
    #horse;
    #azimuth;
    #elevation;
    #distance;
    #velocityAzimuth;
    #velocityElevation;
    #velocityDistance;
    #rotation;
    #time;

    static async main() {
        const gl = document.querySelector(Carousel.#SELECTOR_CANVAS).getContext(Carousel.#CONTEXT);
        const carousel = await new Carousel(gl);
        requestAnimationFrame(carousel.render.bind(carousel));
    }

    constructor(gl) {
        this.#gl = gl;
        return (async () => {
            this.#renderer = await new CarouselRenderer(this.#gl, Carousel.#ATTRIBUTES);
            this.#platform = new Platform(this.#gl, this.#renderer.attributes);
            this.#pole = new Pole(this.#gl, this.#renderer.attributes);
            this.#horse = new Horse(this.#gl, this.#renderer.attributes);
            this.azimuth = 0.0;
            this.elevation = 0.0;
            this.distance = Configuration.distance.max;
            this.#velocityAzimuth = 0.0;
            this.#velocityElevation = 0.0;
            this.#velocityDistance = 0.0;
            this.#rotation = 0.0;
            this.#time = 0;
            this.#gl.clearColor(...Configuration.clear.color);
            this.#gl.clearDepth(Configuration.clear.depth);
            this.#gl.depthFunc(this.#gl.LEQUAL);
            this.#gl.enable(this.#gl.DEPTH_TEST);
            this.#gl.cullFace(this.#gl.BACK);
            this.#gl.enable(this.#gl.CULL_FACE);
            this.#gl.canvas.addEventListener(Event.KEY_DOWN, this.keyboard.bind(this));
            this.#gl.canvas.addEventListener(Event.KEY_UP, this.keyboard.bind(this));
            this.#gl.canvas.focus();
            return this;
        })();
    }

    get azimuth() {
        return this.#azimuth;
    }

    set azimuth(azimuth) {
        this.#azimuth = azimuth;
        if (this.#azimuth < 0) {
            this.#azimuth += 2 * Math.PI;
        } else if (this.#azimuth >= 2 * Math.PI) {
            this.#azimuth -= 2 * Math.PI;
        }
        document.querySelector(Carousel.#SELECTOR_AZIMUTH).firstChild.nodeValue =
                Carousel.#FORMAT_ANGLE(this.#azimuth);
    }

    get elevation() {
        return this.#elevation;
    }

    set elevation(elevation) {
        this.#elevation = Math.min(Math.max(elevation, -Math.PI / 2), Math.PI / 2);
        document.querySelector(Carousel.#SELECTOR_ELEVATION).firstChild.nodeValue =
                Carousel.#FORMAT_ANGLE(this.#elevation);
    }

    get distance() {
        return this.#distance;
    }

    set distance(distance) {
        this.#distance = Math.min(Math.max(distance, Configuration.distance.min), Configuration.distance.max);
        document.querySelector(Carousel.#SELECTOR_DISTANCE).firstChild.nodeValue =
                Carousel.#FORMAT_DISTANCE(this.#distance);
    }

    set fps(fps) {
        document.querySelector(Carousel.#SELECTOR_FPS).firstChild.nodeValue = fps;
    }

    get rotation() {
        return this.#rotation;
    }

    set rotation(rotation) {
        this.#rotation = rotation;
        if (this.#rotation >= 2 * Math.PI) {
            this.#rotation -= 2 * Math.PI;
        }
    }

    keyboard(event) {
        this.#velocityAzimuth = 0.0;
        this.#velocityElevation = 0.0;
        this.#velocityDistance = 0.0;
        if (event.type == Event.KEY_DOWN) {
            switch (event.code) {
            case KeyCode.ARROW_UP:
                this.#velocityElevation = Configuration.elevation.velocity;
                break;
            case KeyCode.ARROW_DOWN:
                this.#velocityElevation = -Configuration.elevation.velocity;
                break;
            case KeyCode.ARROW_LEFT:
                this.#velocityAzimuth = Configuration.azimuth.velocity;
                break;
            case KeyCode.ARROW_RIGHT:
                this.#velocityAzimuth = -Configuration.azimuth.velocity;
                break;
            case KeyCode.PAGE_UP:
                this.#velocityDistance = Configuration.distance.velocity;
                break;
            case KeyCode.PAGE_DOWN:
                this.#velocityDistance = -Configuration.distance.velocity;
                break;
            }
        }
    }

    render(time) {
        this.idle(time);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
        this.#gl.useProgram(this.#renderer.program);
        this.#gl.uniformMatrix4fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_PROJECTION], false,
                this.#projection);
        this.#gl.uniformMatrix4fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_CAMERA], false, this.#camera);
        this.#gl.uniformMatrix4fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_MODEL], false, this.#model);
        this.#gl.uniform3fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_LIGHT_AMBIENT],
            Configuration.light.ambient.color);
        this.#gl.uniform3fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_LIGHT_DIRECTIONAL_COLOR],
                Configuration.light.directional.color);
        this.#gl.uniform3fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_LIGHT_DIRECTIONAL_DIRECTION],
                Configuration.light.directional.direction);
        this.#platform.render();
        for (let i = 0; i < Configuration.platform.poles; i++) {
            this.#gl.uniformMatrix4fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_MODEL], false,
                    this.#poleModel(this.#model, i));
            this.#pole.render();
            this.#gl.uniformMatrix4fv(this.#renderer.uniforms[CarouselRenderer.UNIFORM_MODEL], false,
            this.#horseModel(this.#model, i));
            this.#horse.render();
        }
        requestAnimationFrame(this.render.bind(this));
    }

    idle(time) {
        const dt = (time - this.#time) / Carousel.#MS_PER_S;
        this.fps = 1 / dt;
        this.azimuth += this.#velocityAzimuth * dt;
        this.elevation += this.#velocityElevation * dt;
        this.distance += this.#velocityDistance * dt;
        this.rotation += Configuration.rotation.velocity * dt;
        this.#time = time;
    }

    get #projection() {
        const projection = mat4.create();
        mat4.perspective(projection, Configuration.projection.fieldOfView,
                this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight,
                Configuration.projection.z.near, Configuration.projection.z.far);
        return projection;
    }

    get #camera() {
        const camera = mat4.create();
        mat4.rotateY(camera, camera, -this.azimuth);
        mat4.rotateX(camera, camera, -this.elevation);
        mat4.translate(camera, camera, [0.0, 0.0, this.distance]);
        return camera;
    }

    get #model() {
        const model = mat4.create();
        mat4.rotateY(model, model, this.rotation);
        return model;
    }

    #poleModel(parent, i) {
        const angle = i * 2 * Math.PI / Configuration.platform.poles;
        const model = mat4.create();
        mat4.multiply(model, model, parent);
        mat4.translate(model, model, [Math.cos(angle) * Configuration.poles.distance,
                Configuration.platform.base.height, Math.sin(angle) * Configuration.poles.distance]);
        return model;
    }

    #horseModel(parent, i) {
        const angle = i * 2 * Math.PI / Configuration.platform.poles;
        const model = mat4.create();
        mat4.multiply(model, model, parent);
        mat4.rotateY(model, model, angle);
        mat4.translate(model, model, [Configuration.poles.distance,
            1.0 + Math.sin(this.#rotation + Configuration.horse.frequency * angle), 0.0]); // TODO
        mat4.rotateY(model, model, Math.PI);
        return model;
    }
}
