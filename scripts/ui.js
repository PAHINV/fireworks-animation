import { startRecording, stopRecording, isRecording } from "./recording.js";

export function setupUI(controls) {
  // --- UI Elements ---
  const controlsContainer = document.getElementById("controls-container");
  const toggleButton = document.getElementById("toggle-controls");
  const accordionItems = document.querySelectorAll(".accordion-item");
  const recordButton = document.getElementById("record-button");

  // --- UI Event Listeners ---
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      if (controlsContainer) {
        controlsContainer.classList.toggle("collapsed");
      }
    });
  }

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");
    header.addEventListener("click", () => {
      const currentlyActive = document.querySelector(".accordion-item.active");
      if (currentlyActive && currentlyActive !== item) {
        currentlyActive.classList.remove("active");
        currentlyActive.querySelector(".accordion-content").style.maxHeight = 0;
      }

      item.classList.toggle("active");
      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = 0;
      }
    });
  });

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
