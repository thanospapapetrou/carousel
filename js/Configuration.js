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
        max: 50, // 50 m
        velocity: 25.0 // 25 m/s
    },
    rotation: {
        velocity: 1.57079632679 // π/2 rad/s
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
        sectors: 16,
        base: {
            radius: 10.0
        }
    }
});
