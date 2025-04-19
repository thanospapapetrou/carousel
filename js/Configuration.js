'use strict';

const Configuration = Object.freeze({
    clear: {
        color: [0.0, 0.0, 0.0, 1.0], // black
        depth: 1.0 // max
    },
    projection: {
        fieldOfView: 1.57079632679, // π/2 rad
        z: {
            near: 0.1, // 0.1 m
            far: 100.0 // 100 m
        }
    },
    azimuth: 1.57079632679, // π/2 rad/s
    elevation: 1.57079632679, // π/2 rad/s
    distance: {
        min: 0.1, // 0.1 m
        max: 100, // 100 m
        velocity: 25.0 // 25 m/s
    },
    rotation: 1.57079632679 // π/2 rad/s
});
