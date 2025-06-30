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

  text1Overlay: `HAPPY
4th of 
JULY`,
  text1X: 50,
  text1Y: 44,
  text1Align: "center",
  font1: "Playfair Display",
  font1Size: 80,
  font1Color: "#bbadff",
  text1Opacity: 1,

  text2Overlay: `independence day`,
  text2X: 50,
  text2Y: 70,
  text2Align: "center",
  font2: "Lobster",
  font2Size: 40,
  font2Color: "#cff028",
  text2Opacity: 1,

  resolution: "hd",
  framerate: 60
};

// --- Start the animation ---
window.onload = function () {
  initializeControls(controls);
  setupControlListeners(controls);
  setupUI(controls);
  animate(controls);
};
