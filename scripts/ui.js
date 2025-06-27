import { startRecording, stopRecording, isRecording } from "./recording.js";

export function setupUI(controls) {
  // --- UI Elements ---
  const controlsContainer = document.getElementById("controls-container");
  const toggleButton = document.getElementById("toggle-controls");
  const recordButton = document.getElementById("record-button");

  // --- UI Event Listeners ---
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      if (controlsContainer) {
        controlsContainer.classList.toggle("collapsed");
      }
    });
  }

  if (recordButton) {
    recordButton.addEventListener("click", () => {
      if (isRecording()) {
        stopRecording(controls);
      } else {
        startRecording(controls);
      }
    });
  }
}
