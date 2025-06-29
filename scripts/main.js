import { setupControlListeners } from "./controls.js";
import { animate } from "./fireworks.js";
import { setupUI } from "./ui.js";

// --- Global Control Variables ---
const controls = {
  launchFreq: 20,
  gravity: 0.02,
  trailLength: 0.1,
  speed: 2,
  sizeMin: 1,
  sizeMax: 3,
  globalSpeed: 1,
  particleCount: 150,
  resolution: "hd",
  framerate: 60,
  textOverlay: "",
  textX: 50,
  textY: 50,
  textAlign: "center",
  font: "Roboto",
  fontSize: 48,
  fontColor: "#FFFFFF",
  textOpacity: 1
};

// --- Start the animation ---
window.onload = function () {
  setupControlListeners(controls);
  setupUI(controls);
  animate(controls);
};
