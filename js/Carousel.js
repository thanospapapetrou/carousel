'use strict';

class Carousel {
    static #ATTRIBUTES = ['position', 'normal', 'color'];
    static #CONTEXT = 'webgl2';
    static #ERROR_LOADING = (url, status) => `Error loading ${url}: HTTP status ${status}`;
    static #FORMAT_ANGLE = (angle) => `${angle} rad (${angle * 180 / Math.PI} °)`;
    static #FORMAT_DISTANCE = (distance) => `${distance} m`;
    static #MS_PER_S = 1000;
    static #LIGHT = {
        ambient: [0.25, 0.25, 0.25],
        directional: {
            color: [0.75, 0.25, 0.25],
            direction: [0.0, 1.0, 0.0]
        }
    };
    static #SELECTOR_AZIMUTH = 'span#azimuth';
    static #SELECTOR_CANVAS = 'canvas#carousel';
    static #SELECTOR_DISTANCE = 'span#distance';
    static #SELECTOR_ELEVATION = 'span#elevation';
    static #SELECTOR_FPS = 'span#fps';
    static #SHADER_FRAGMENT = './glsl/carousel.frag';
    static #SHADER_VERTEX = './glsl/carousel.vert';
    static #UNIFORM_CAMERA = 'camera';
    static #UNIFORM_LIGHT_AMBIENT = 'light.ambient';
    static #UNIFORM_LIGHT_DIRECTIONAL_COLOR = 'light.directional.color';
    static #UNIFORM_LIGHT_DIRECTIONAL_DIRECTION = 'light.directional.direction';
    static #UNIFORM_MODEL = 'model';
    static #UNIFORM_PROJECTION = 'projection';

    #gl;
    #renderer;
    #renderables;
    #azimuth;
    #elevation;
    #distance;
    #velocityAzimuth;
    #velocityElevation;
    #velocityDistance;
    #rotation;
    #time;

    static main() {
        Carousel.#load(Carousel.#SHADER_VERTEX).then((response) => response.text()).then((vertex) => {
            Carousel.#load(Carousel.#SHADER_FRAGMENT).then((response) => response.text()).then((fragment) => {
                const gl = document.querySelector(Carousel.#SELECTOR_CANVAS).getContext(Carousel.#CONTEXT);
                const renderer = new Renderer(gl, vertex, fragment, [Carousel.#UNIFORM_PROJECTION,
                        Carousel.#UNIFORM_CAMERA, Carousel.#UNIFORM_MODEL, Carousel.#UNIFORM_LIGHT_AMBIENT,
                        Carousel.#UNIFORM_LIGHT_DIRECTIONAL_COLOR, Carousel.#UNIFORM_LIGHT_DIRECTIONAL_DIRECTION],
                        Carousel.#ATTRIBUTES);
                const carousel = new Carousel(gl, renderer, [
                        new Renderable(gl, renderer.attributes, {
                            positions: [
                                0, -0.4999999999999998, -0.8660254037844387,
                                0.7500000000000001, -0.4999999999999998, 0.4330127018922192,
                                -0.7499999999999998, -0.4999999999999998, 0.43301270189221974,
                                0, 1, 0,
                                0, -0.4999999999999998, -0.8660254037844387,
                                -0.7499999999999998, -0.4999999999999998, 0.43301270189221974,
                                0, 1, 0,
                                0.7500000000000001, -0.4999999999999998, 0.4330127018922192,
                                0, -0.4999999999999998, -0.8660254037844387,
                                0, 1, 0,
                                -0.7499999999999998, -0.4999999999999998, 0.43301270189221974,
                                0.7500000000000001, -0.4999999999999998, 0.4330127018922192
                            ],
                            normals: [
                                0.0, -1.0, 0.0,
                                0.0, -1.0, 0.0,
                                0.0, -1.0, 0.0,
                                -0.7500000000000001, 0.4999999999999998, -0.4330127018922192,
                                -0.7500000000000001, 0.4999999999999998, -0.4330127018922192,
                                -0.7500000000000001, 0.4999999999999998, -0.4330127018922192,
                                0.7499999999999998, 0.4999999999999998, -0.43301270189221974,
                                0.7499999999999998, 0.4999999999999998, -0.43301270189221974,
                                0.7499999999999998, 0.4999999999999998, -0.43301270189221974,
                                0.0, 0.4999999999999998, 0.8660254037844387,
                                0.0, 0.4999999999999998, 0.8660254037844387,
                                0.0, 0.4999999999999998, 0.8660254037844387
                            ],
                            colors: [
                                1.0, 0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0, 1.0,
                                0.0, 1.0, 0.0, 1.0,
                                0.0, 1.0, 0.0, 1.0,
                                0.0, 1.0, 0.0, 1.0,
                                0.0, 0.0, 1.0, 1.0,
                                0.0, 0.0, 1.0, 1.0,
                                0.0, 0.0, 1.0, 1.0,
                                1.0, 1.0, 0.0, 1.0,
                                1.0, 1.0, 0.0, 1.0,
                                1.0, 1.0, 0.0, 1.0
                            ],
                            indices: [
                                0, 1, 2,
                                3, 4, 5,
                                6, 7, 8,
                                9, 10, 11
                            ]
                        })]);
                requestAnimationFrame(carousel.render.bind(carousel));
            })
        });
    }

    static #load(url) {
        return fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error(Carousel.#ERROR_LOADING(url, response.status));
            }
            return response;
        });
    }

    constructor(gl, renderer, renderables) {
        this.#gl = gl;
        this.#renderer = renderer;
        this.#renderables = renderables;
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
        document.querySelector(Carousel.#SELECTOR_AZIMUTH).firstChild.nodeValue = Carousel.#FORMAT_ANGLE(this.#azimuth);
    }

    get elevation() {
        return this.#elevation;
    }

    set elevation(elevation) {
        this.#elevation = Math.min(Math.max(elevation, -Math.PI / 2), Math.PI / 2);
        document.querySelector(Carousel.#SELECTOR_ELEVATION).firstChild.nodeValue = Carousel.#FORMAT_ANGLE(this.#elevation);
    }

    get distance() {
        return this.#distance;
    }

    set distance(distance) {
        this.#distance = Math.min(Math.max(distance, Configuration.distance.min), Configuration.distance.max);
        document.querySelector(Carousel.#SELECTOR_DISTANCE).firstChild.nodeValue = Carousel.#FORMAT_DISTANCE(this.#distance);
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
                this.#velocityElevation = Configuration.elevation;
                break;
            case KeyCode.ARROW_DOWN:
                this.#velocityElevation = -Configuration.elevation;
                break;
            case KeyCode.ARROW_LEFT:
                this.#velocityAzimuth = Configuration.azimuth;
                break;
            case KeyCode.ARROW_RIGHT:
                this.#velocityAzimuth = -Configuration.azimuth;
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
        this.#gl.uniformMatrix4fv(this.#renderer.uniforms[Carousel.#UNIFORM_PROJECTION], false, this.#projection);
        this.#gl.uniformMatrix4fv(this.#renderer.uniforms[Carousel.#UNIFORM_CAMERA], false, this.#camera);
        this.#gl.uniform3fv(this.#renderer.uniforms[Carousel.#UNIFORM_LIGHT_AMBIENT], Carousel.#LIGHT.ambient);
        this.#gl.uniform3fv(this.#renderer.uniforms[Carousel.#UNIFORM_LIGHT_DIRECTIONAL_COLOR],
                Carousel.#LIGHT.directional.color);
        this.#gl.uniform3fv(this.#renderer.uniforms[Carousel.#UNIFORM_LIGHT_DIRECTIONAL_DIRECTION],
                Carousel.#LIGHT.directional.direction);
        const n = 3;
        const m = 4;
        const l = 5;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                for (let k = 0; k < l; k++) {
                    this.#gl.uniformMatrix4fv(this.#renderer.uniforms[Carousel.#UNIFORM_MODEL], false, this.#model(i, j, k));
                    this.#renderables[(i * m * l + j * l + k) % this.#renderables.length].render();
                }
            }
        }
        requestAnimationFrame(this.render.bind(this));
    }

    idle(time) {
    const dt = (time - this.#time) / Carousel.#MS_PER_S;
        this.fps = 1 / dt;
        this.azimuth += this.#velocityAzimuth * dt;
        this.elevation += this.#velocityElevation * dt;
        this.distance += this.#velocityDistance * dt;
        this.rotation += Configuration.rotation * dt;
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

    #model(i, j, k) {
        const model = mat4.create();
        mat4.translate(model, model, [2 * i, 2 * j, 2 * k]);
        mat4.rotateX(model, model, this.rotation * i);
        mat4.rotateY(model, model, this.rotation * j);
        mat4.rotateZ(model, model, this.rotation * k);
        return model;
    }
}
