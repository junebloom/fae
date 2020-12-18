import { getTime } from "./getTime.js";

// This is the default game loop used if you do not provide a custom
// `startGame` function to the Application constructor.
export function startDefaultLoop(app) {
  let lastTime = getTime();
  let currentTime, dt;
  let cancelHandle = null;

  function step() {
    // Calculate frame delta time in seconds.
    currentTime = getTime();
    dt = currentTime - lastTime;
    lastTime = currentTime;

    app.event.emit("update", dt);
    app.event.emit("draw");
  }

  // Start the loop using RAF, if available.
  if (globalThis.requestAnimationFrame) {
    const loop = () => {
      step();
      cancelHandle = requestAnimationFrame(loop);
    };

    loop();

    // Return a function that terminates the loop.
    return () => cancelAnimationFrame(cancelHandle);
  }

  // If RAF is not available, use setInterval.
  else {
    cancelHandle = setInterval(step, 1000 / 60);

    // Return a function that terminates the loop.
    return () => clearInterval(cancelHandle);
  }
}
