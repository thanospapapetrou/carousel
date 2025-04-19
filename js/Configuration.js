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
    azimuth: {
        velocity: 1.57079632679, // π/2 rad/s
    },
    elevation: {
        velocity: 1.57079632679, // π/2 rad/s
    },
    distance: {
        min: 0.1, // 0.1 m
        max: 10, // 10 m
        velocity: 5.0 // 5 m/s
    },
    rotation: {
        velocity: 0.157079632679 // π/20 rad/s
    },
    light: {
        ambient: {
            color: [0.25, 0.25, 0.25] // 25% white
        },
        directional: {
            color: [0.75, 0.75, 0.75], // 75% white
            direction: [-1.0, -1.0, -1.0]
        }
    },
    platform: {
        sectors: 64,
        base: {
            radius: 2.0, // 2 m
            height: 0.2 // 0.2 m
        },
        pole: {
            radius: 0.5, // 0.5 m
            height: 2.0 // 2 m
        },
        roof: {
            radius: 2.0, // 2 m
            height: 1.0 // 1 m
        }
    }
});
