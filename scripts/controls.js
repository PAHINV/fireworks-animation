import { isRecording } from "./recording.js";

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
  const setupControlListener = (id, property, valueId, multiplier = 1, fixed = 2) => {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(valueId);
    if (slider) {
      slider.addEventListener("input", () => {
        if (isRecording()) {
          slider.value = controls[property] / multiplier;
          return;
        }
        const value = parseFloat(slider.value) * multiplier;
        controls[property] = value;
        if (valueDisplay) {
          valueDisplay.textContent = value.toFixed(fixed);
        }
      });
    }
  };

  // Initialize all control listeners...
  setupControlListener("launch-freq", "launchFreq", "launch-freq-value", 1, 0);
  setupControlListener("gravity", "gravity", "gravity-value", 0.01, 2);
  setupControlListener("trail-length", "trailLength", "trail-length-value", 0.01, 2);
  setupControlListener("speed", "speed", "speed-value", 1, 1);
  setupControlListener("size-min", "sizeMin", "size-min-value", 1, 1);
  setupControlListener("size-max", "sizeMax", "size-max-value", 1, 1);
  setupControlListener("global-speed", "globalSpeed", "global-speed-value", 1, 1);
  setupControlListener("particle-count", "particleCount", "particle-count-value", 1, 0);
  setupControlListener("text-x", "textX", "text-x-value", 1, 0);
  setupControlListener("text-y", "textY", "text-y-value", 1, 0);
  setupTextListener("text-overlay", "textOverlay");
  setupColorListener("font-color", "fontColor");
  setupControlListener("font-size", "fontSize", "font-size-value", 1, 0);
  setupControlListener("text-opacity", "textOpacity", "text-opacity-value", 1, 2);
  setupSelectListener("font-select", "font");

  // --- Event Listeners for Toggles ---
  const setupToggleListener = (containerId, property, dataAttribute) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", (e) => {
      if (isRecording() || !e.target.matches(".toggle-btn")) return;

      const value = e.target.dataset[dataAttribute];
      controls[property] = isNaN(value) ? value : parseInt(value, 10);

      const currentActive = container.querySelector(".active");
      if (currentActive) currentActive.classList.remove("active");
      e.target.classList.add("active");
    });
  };

  setupToggleListener("resolution-toggle", "resolution", "resolution");
  setupToggleListener("framerate-toggle", "framerate", "framerate");
  setupToggleListener("text-align-toggle", "textAlign", "align");
}
