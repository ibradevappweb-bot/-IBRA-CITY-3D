# IBRA CITY 3D

**IBRA CITY 3D** is a browser-based 3D driving game project built with Three.js and TypeScript.

The project direction is an optimized-realism open-city driving experience with accessible vehicle handling, free roam, career missions, multiple cameras, vehicle customization, moderate traffic, a small pedestrian population, and a day/night cycle.

## Current development stage

**Stage 1 — Technical foundations**

The current foundation includes:
- A dark premium blue-accented main menu.
- A Three.js test scene with camera, lighting, ground, and placeholder skyline geometry.
- Three graphics profiles: Economic, Balanced, and Quality.
- Responsive layout for mobile and desktop browsers.
- Local persistence for the selected graphics profile.

This is a development foundation, not yet the complete game. There is no drivable vehicle, finished city, vehicle physics, traffic, career mode, or multiplayer at this stage.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Validate

```bash
npm run typecheck
npm run build
npm run preview
```

## Technology

- Three.js — 3D rendering
- TypeScript — game logic
- Vite — development server and production build

## Planned development sequence

1. Technical foundations and responsive interface.
2. First vehicle model and touch controls.
3. Vehicle handling and collision physics.
4. First playable urban district.
5. Rear, cockpit, and free exterior cameras.
6. Lightweight traffic and pedestrians.
7. Day/night lighting.
8. Garage and vehicle customization.
9. Career missions and progression.
10. Performance tuning and web release.

## Performance target

The initial mobile target is approximately 30 FPS where hardware and scene complexity allow. This is a goal to measure on real devices, not a guaranteed result.

## Project status

Early development. See the repository history for the exact files and changes delivered so far.
