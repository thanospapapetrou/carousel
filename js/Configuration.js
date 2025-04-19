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
        poles: 8,
        sectors: 64,
        base: {
            height: 0.2, // 0.2 m,
            radius: 2.0, // 2 m
            color: [0.0, 0.0, 1.0, 1.0] // blue
        },
        pole: {
            height: 2.0, // 2 m
            radius: 0.5, // 0.5 m
            color: [1.0, 0.0, 0.0, 1.0] // red
        },
        roof: {
            height: 1.0, // 1 m
            radius: 2.0, // 2 m
            bottom: [1.0, 0.0, 1.0, 1.0], // purple
            top: [1.0, 1.0, 0.0, 1.0] // yellow
        }
    },
    poles: {
        distance: 1.75, // 1.75 m
        radius: 0.05, // 0.05 m
        sectors: 8,
        color: [0.0, 1.0, 0.0, 1.0] // green
    },
    horse: {
        frequency: 2.0, // 2 Hz
        color: [1.0, 1.0, 1.0, 1.0], // white
        body: {
            length: 1, // 1 m
            radius: 0.25, // 0.25 m
            sectors: 16
        },
        neck: {
            height: 0.5, // 0.5 m
            radius: 0.125, // 0.125 m
            sectors: 8
        }
    }
});
