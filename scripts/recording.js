// --- Recording Variables ---
let mediaRecorder;
let recordedChunks = [];
let recording = false;
let recordingStartTime;
let timerInterval;
let originalCanvasSize = { width: 0, height: 0 };

const timerElement = document.getElementById("timer");
const recordButton = document.getElementById("record-button");
const controlsContainer = document.getElementById("controls-container");

export function isRecording() {
  return recording;
}

// --- Recording Functions ---
export function startRecording(controls) {
  const canvas = document.getElementById("fireworksCanvas");
  if (!("MediaRecorder" in window) || !canvas.captureStream) {
    alert("Your browser does not support video recording.");
    return;
  }
  recording = true;

  // Store original canvas size to restore it later
  originalCanvasSize = { width: window.innerWidth, height: window.innerHeight };

  const resolutions = {
    sd: { width: 640, height: 480 },
    hd: { width: 1280, height: 720 },
    "2k": { width: 2048, height: 1080 },
    "4k": { width: 3840, height: 2160 }
  };

  const { width: recWidth, height: recHeight } = resolutions[controls.resolution];

  // Resize canvas for recording
  canvas.width = recWidth;
  canvas.height = recHeight;

  if (recordButton) {
    recordButton.textContent = "Stop & Save";
    recordButton.classList.add("recording");
  }
  if (controlsContainer) {
    controlsContainer.classList.add("collapsed", "recording-active"); // Collapse panel and mark as recording
  }

  recordedChunks = [];

  const stream = canvas.captureStream(controls.framerate); // Capture at selected fps
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fireworks-${controls.resolution}-${controls.framerate}fps-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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

export function stopRecording() {
  const canvas = document.getElementById("fireworksCanvas");
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  recording = false;
  if (recordButton) {
    recordButton.textContent = "Record";
    recordButton.classList.remove("recording");
  }
  if (controlsContainer) {
    controlsContainer.classList.remove("collapsed", "recording-active"); // Expand panel and remove recording state
  }

  // Stop and hide timer
  clearInterval(timerInterval);
  if (timerElement) {
    timerElement.classList.remove("visible");
  }

  // Restore original canvas size
  canvas.width = originalCanvasSize.width;
  canvas.height = originalCanvasSize.height;
}
