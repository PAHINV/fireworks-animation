// import { isRecording } from "./recording.js";

export function initializeControls(controls) {
  // Initialize sliders and their value displays
  const initSlider = (id, property, valueId, multiplier = 1, fixed = 2) => {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(valueId);
    if (slider) {
      const value = controls[property];
      slider.value = value / multiplier;
      if (valueDisplay) {
        valueDisplay.textContent = value.toFixed(fixed);
      }
    }
  };

  initSlider("launch-freq", "launchFreq", "launch-freq-value", 1, 0);
  initSlider("gravity", "gravity", "gravity-value", 0.01, 2);
  initSlider("trail-length", "trailLength", "trail-length-value", 0.01, 2);
  initSlider("speed", "speed", "speed-value", 1, 1);
  initSlider("size-min", "sizeMin", "size-min-value", 1, 1);
  initSlider("size-max", "sizeMax", "size-max-value", 1, 1);
  initSlider("global-speed", "globalSpeed", "global-speed-value", 1, 1);
  initSlider("particle-count", "particleCount", "particle-count-value", 1, 0);
  initSlider("text-1-x", "text1X", "text-1-x-value", 1, 0);
  initSlider("text-1-y", "text1Y", "text-1-y-value", 1, 0);
  initSlider("font-1-size", "font1Size", "font-1-size-value", 1, 0);
  initSlider("text-1-opacity", "text1Opacity", "text-1-opacity-value", 1, 2);
  initSlider("text-2-x", "text2X", "text-2-x-value", 1, 0);
  initSlider("text-2-y", "text2Y", "text-2-y-value", 1, 0);
  initSlider("font-2-size", "font2Size", "font-2-size-value", 1, 0);
  initSlider("text-2-opacity", "text2Opacity", "text-2-opacity-value", 1, 2);

  // Initialize other inputs
  const text1Overlay = document.getElementById("text-1-overlay");
  if (text1Overlay) text1Overlay.value = controls.text1Overlay;

  const font1Color = document.getElementById("font-1-color");
  if (font1Color) font1Color.value = controls.font1Color;

  const font1Select = document.getElementById("font-1-select");
  if (font1Select) font1Select.value = controls.font1;

  const text2Overlay = document.getElementById("text-2-overlay");
  if (text2Overlay) text2Overlay.value = controls.text2Overlay;

  const font2Color = document.getElementById("font-2-color");
  if (font2Color) font2Color.value = controls.font2Color;

  const font2Select = document.getElementById("font-2-select");
  if (font2Select) font2Select.value = controls.font2;
}

export function setupControlListeners(controls) {
  const setupTextListener = (id, property) => {
    const textInput = document.getElementById(id);
    if (textInput) {
      textInput.addEventListener("input", () => {
        controls[property] = textInput.value;
      });
    }
  };
  const setupSelectListener = (id, property) => {
    const select = document.getElementById(id);
    if (select) {
      select.addEventListener("change", () => {
        controls[property] = select.value;
      });
    }
  };

  const setupColorListener = (id, property) => {
    const colorInput = document.getElementById(id);

    if (colorInput) {
      colorInput.addEventListener("input", () => {
        controls[property] = colorInput.value;
      });
    }
  };

  // --- Event Listeners for Controls ---
  const setupControlListener = (
    id,
    property,
    valueId,
    multiplier = 1,
    fixed = 2
  ) => {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(valueId);
    if (slider) {
      slider.addEventListener("input", () => {
        /* if (isRecording()) {
          slider.value = controls[property] / multiplier;
          return;
        } */
        const value = parseFloat(slider.value) * multiplier;
        controls[property] = value;
        if (valueDisplay) {
          valueDisplay.textContent = value.toFixed(fixed);
        }
      });
    }
  };

  // Initialize all control listeners...
  setupColorListener("bg-color", "backgroundColor");
  setupControlListener("launch-freq", "launchFreq", "launch-freq-value", 1, 0);
  setupControlListener("gravity", "gravity", "gravity-value", 0.01, 2);
  setupControlListener(
    "trail-length",
    "trailLength",
    "trail-length-value",
    0.01,
    2
  );
  setupControlListener("speed", "speed", "speed-value", 1, 1);
  setupControlListener("size-min", "sizeMin", "size-min-value", 1, 1);
  setupControlListener("size-max", "sizeMax", "size-max-value", 1, 1);
  setupControlListener(
    "global-speed",
    "globalSpeed",
    "global-speed-value",
    1,
    1
  );
  setupControlListener(
    "particle-count",
    "particleCount",
    "particle-count-value",
    1,
    0
  );

  // Text 1
  setupControlListener("text-1-x", "text1X", "text-1-x-value", 1, 0);
  setupControlListener("text-1-y", "text1Y", "text-1-y-value", 1, 0);
  setupTextListener("text-1-overlay", "text1Overlay");
  setupColorListener("font-1-color", "font1Color");
  setupControlListener("font-1-size", "font1Size", "font-1-size-value", 1, 0);
  setupControlListener(
    "text-1-opacity",
    "text1Opacity",
    "text-1-opacity-value",
    1,
    2
  );
  setupSelectListener("font-1-select", "font1");

  // Text 2
  setupControlListener("text-2-x", "text2X", "text-2-x-value", 1, 0);
  setupControlListener("text-2-y", "text2Y", "text-2-y-value", 1, 0);
  setupTextListener("text-2-overlay", "text2Overlay");
  setupColorListener("font-2-color", "font2Color");
  setupControlListener("font-2-size", "font2Size", "font-2-size-value", 1, 0);
  setupControlListener(
    "text-2-opacity",
    "text2Opacity",
    "text-2-opacity-value",
    1,
    2
  );
  setupSelectListener("font-2-select", "font2");

  // --- Event Listeners for Toggles ---
  const setupToggleListener = (containerId, property, dataAttribute) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", (e) => {
      // if (isRecording() || !e.target.matches(".toggle-btn")) return;

      const value = e.target.dataset[dataAttribute];
      controls[property] = isNaN(value) ? value : parseInt(value, 10);

      const currentActive = container.querySelector(".active");
      if (currentActive) currentActive.classList.remove("active");
      e.target.classList.add("active");
    });
  };

  setupToggleListener("resolution-toggle", "resolution", "resolution");
  setupToggleListener("framerate-toggle", "framerate", "framerate");
  setupToggleListener("text-1-align-toggle", "text1Align", "align");
  setupToggleListener("text-2-align-toggle", "text2Align", "align");
}
