import { getTime } from "./getTime.js";

// This is the default game loop used if you do not provide a custom
// `startGame` function to the Application constructor.
export function startDefaultLoop(app) {
  let lastTime = getTime();
  let currentTime, dt;

  function step() {
    // Calculate frame delta time in seconds.
    currentTime = getTime();
    dt = currentTime - lastTime;
    lastTime = currentTime;

    app.event.emit("update", dt);
    app.event.emit("draw");
  }

  // Function to start looping using requestAnimationFrame.
  function rafLoop() {
    step();
    requestAnimationFrame(rafLoop);
  }

  // Use requestAnimationFrame if available, otherwise use setInterval.
  if (globalThis.requestAnimationFrame) requestAnimationFrame(rafLoop);
  else setInterval(step, 1000 / 60);
}
