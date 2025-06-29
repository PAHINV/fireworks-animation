import { initializeControls, setupControlListeners } from "./controls.js";
import { animate } from "./fireworks.js";
import { setupUI } from "./ui.js";

// --- Global Control Variables ---
const controls = {
  backgroundColor: "#000000",
  launchFreq: 28,
  gravity: 0.02,
  trailLength: 0.1,
  speed: 2,
  sizeMin: 1,
  sizeMax: 3,
  globalSpeed: 1,
  particleCount: 150,
  resolution: "hd",
  framerate: 60,
  textOverlay: `HAPPY
4th of 
JULY`,
  textX: 50,
  textY: 44,
  textAlign: "center",
  font: "Playfair Display",
  fontSize: 80,
  fontColor: "#bbadff",
  textOpacity: 1
};

// --- Start the animation ---
window.onload = function () {
  initializeControls(controls);
  setupControlListeners(controls);
  setupUI(controls);
  animate(controls);
};
