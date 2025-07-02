import { resetAnimation } from "./fireworks.js";

let mediaRecorder;
let recordedChunks = [];

let recordingStartTime;
let timerInterval;

const timerElement = document.getElementById("timer");
const recordButton = document.getElementById("record-button");

// --- Recording Functions ---
function startRecording(canvas, framerate) {
  if (!("MediaRecorder" in window) || !canvas.captureStream) {
    alert("Your browser does not support video recording.");
    return;
  }

  // Start fresh animation
  resetAnimation();

  if (recordButton) {
    recordButton.textContent = "Stop & Save";
    recordButton.classList.add("recording");
  }
  const stream = canvas.captureStream(framerate);
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9"
  });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-recording.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    recordedChunks = [];
  };

  recordedChunks = [];
  mediaRecorder.start();

  // Start timer
  recordingStartTime = Date.now();
  if (timerElement) {
    timerElement.textContent = "00:00";
    timerElement.classList.add("visible");
  }
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  }, 1000);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  if (recordButton) {
    recordButton.textContent = "Record";
    recordButton.classList.remove("recording");
  }

  // Stop and hide timer
  clearInterval(timerInterval);
  if (timerElement) {
    timerElement.classList.remove("visible");
  }
}

export { startRecording, stopRecording };
