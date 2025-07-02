import { startRecording, stopRecording } from "./recording.js";
import { changelogData } from "./changelog.js";

export function setupUI(controls) {
  // --- UI Elements ---
  const controlsContainer = document.getElementById("controls-container");
  const toggleButton = document.getElementById("toggle-controls");
  const accordionItems = document.querySelectorAll(".accordion-item");
  const fullscreenButton = document.getElementById("fullscreen-button");
  const recordButton = document.getElementById("record-button");

  const changelogButton = document.getElementById("changelog-button");
  const changelogPopup = document.getElementById("changelog-popup");
  const closePopupButton = document.getElementById("close-popup");
  const changelogContentContainer = document.getElementById(
    "changelog-content-container"
  );

  const canvas = document.getElementById("fireworksCanvas");
  let isRecording = false;

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
      isRecording = !isRecording;
      if (isRecording) {
        startRecording(canvas, 60); // Start recording at 60fps
        // recordButton.textContent = "Stop Recording";
      } else {
        stopRecording();
        // recordButton.textContent = "Start Recording";
      }
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.body.requestFullscreen();
        document.body.setAttribute("fullscreen", "");
        fullscreenButton.innerHTML = "Exit Fullscreen";
      } else {
        document.exitFullscreen();
        document.body.removeAttribute("fullscreen");
        fullscreenButton.innerHTML = "Go Fullscreen";
      }
    });
  }

  if (changelogButton) {
    changelogButton.addEventListener("click", () => {
      changelogPopup.classList.add("visible");
    });
  }

  if (closePopupButton) {
    closePopupButton.addEventListener("click", () => {
      changelogPopup.classList.remove("visible");
    });
  }

  if (changelogPopup) {
    changelogPopup.addEventListener("click", (e) => {
      if (e.target === changelogPopup) {
        // Close if backdrop is clicked
        changelogPopup.classList.remove("visible");
      }
    });
  }

  // Populate changelog content
  if (changelogContentContainer) {
    changelogContentContainer.innerHTML = changelogData;
  }
}
