// --- Canvas & Context Setup ---
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// --- Recording Variables ---
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let recordingStartTime;
let timerInterval;
let originalCanvasSize = { width: 0, height: 0 };

// --- UI Elements ---
const controlsContainer = document.getElementById("controls-container");
const toggleButton = document.getElementById("toggle-controls");
const recordButton = document.getElementById("record-button");
const timerElement = document.getElementById("timer");

// --- Global Control Variables ---
let controls = {
  launchFreq: 20,
  gravity: 0.02,
  trailLength: 0.1,
  speed: 2,
  sizeMin: 1,
  sizeMax: 3,
  globalSpeed: 1,
  particleCount: 150,
  resolution: "hd",
  framerate: 60
};
let fireworks = [];
let particles = [];
// HSL colors provide vibrant, well-matched firework colors
const colors = [
  0, // Red
  20, // Orange
  40, // Yellow
  60, // Chartreuse
  120, // Green
  180, // Cyan
  240, // Blue
  270, // Violet
  300 // Magenta
];

// --- Utility Functions ---
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// --- Event Listeners for Controls ---
const setupControlListener = (id, property, valueId, multiplier = 1, fixed = 2) => {
  const slider = document.getElementById(id);
  const valueDisplay = document.getElementById(valueId);
  slider.addEventListener("input", () => {
    if (isRecording) {
      // Prevent changing values while recording
      slider.value = controls[property] / multiplier;
      return;
    }
    const value = parseFloat(slider.value) * multiplier;
    controls[property] = value;
    valueDisplay.textContent = value.toFixed(fixed);
  });
};

// Initialize all control listeners...
setupControlListener("launch-freq", "launchFreq", "launch-freq-value", 1, 0);
setupControlListener("gravity", "gravity", "gravity-value", 0.01, 2);
setupControlListener("trail-length", "trailLength", "trail-length-value", 0.01, 2);
setupControlListener("particle-count", "particleCount", "particle-count-value", 1, 0);
setupControlListener("speed", "speed", "speed-value", 1, 1);
setupControlListener("global-speed", "globalSpeed", "global-speed-value", 1, 1);
setupControlListener("size-min", "sizeMin", "size-min-value", 1, 1);
setupControlListener("size-max", "sizeMax", "size-max-value", 1, 1);

const setupToggleListener = (containerId, property, dataAttribute) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.addEventListener("click", (e) => {
    if (isRecording || !e.target.matches(".toggle-btn")) return;

    const value = e.target.dataset[dataAttribute];
    controls[property] = isNaN(value) ? value : parseInt(value, 10);

    // Update active class
    const currentActive = container.querySelector(".active");
    if (currentActive) currentActive.classList.remove("active");
    e.target.classList.add("active");
  });
};

// --- UI Event Listeners ---
toggleButton.addEventListener("click", () => {
  controlsContainer.classList.toggle("collapsed");
});

recordButton.addEventListener("click", () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

// --- Recording Functions ---
function startRecording() {
  if (!("MediaRecorder" in window) || !canvas.captureStream) {
    // Using a custom modal instead of alert
    showModal("Your browser does not support video recording.");
    return;
  }
  isRecording = true;

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
  width = recWidth;
  height = recHeight;
  canvas.width = width;
  canvas.height = height;

  recordButton.textContent = "Stop & Save";
  recordButton.classList.add("recording");
  controlsContainer.classList.add("collapsed", "recording-active"); // Collapse panel and mark as recording

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
  timerElement.textContent = "00:00";
  timerElement.classList.add("visible");
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    timerElement.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  isRecording = false;
  recordButton.textContent = "Record";
  recordButton.classList.remove("recording");
  controlsContainer.classList.remove("collapsed", "recording-active"); // Expand panel and remove recording state

  // Stop and hide timer
  clearInterval(timerInterval);
  timerElement.classList.remove("visible");

  // Restore original canvas size
  width = originalCanvasSize.width;
  height = originalCanvasSize.height;
  canvas.width = width;
  canvas.height = height;
}

// --- Particle & Firework Classes ---
class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity || { x: 0, y: 0 };
    this.size = random(controls.sizeMin, controls.sizeMax);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }
  update() {
    this.x += this.velocity.x * controls.globalSpeed;
    this.y += this.velocity.y * controls.globalSpeed;
    this.velocity.y += controls.gravity * controls.globalSpeed;
    this.alpha -= this.decay * controls.globalSpeed;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = `hsl(${this.color}, 100%, 70%)`;
    ctx.fill();
    ctx.restore();
  }
}
// --- Firework Class ---
// Represents the initial rocket launch that culminates in an explosion.
class Firework {
  constructor() {
    this.x = random(width * 0.2, width * 0.8);
    this.y = height;
    this.targetY = random(height * 0.2, height * 0.5);
    this.color = colors[Math.floor(random(0, colors.length))];
    this.velocity = { x: random(-1, 1), y: -controls.speed * 2.5 };
    this.trail = [];
    this.exploded = false;
  }
  update() {
    if (!this.exploded) {
      this.x += this.velocity.x * controls.globalSpeed;
      this.y += this.velocity.y * controls.globalSpeed;
      this.trail.push(new Particle(this.x, this.y, this.color));
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].update();
      this.trail[i].draw();
      if (this.trail[i].alpha <= 0) {
        this.trail.splice(i, 1);
      }
    }
  }
  explode() {
    const particleCount = controls.particleCount;
    for (let i = 0; i < particleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 5);
      const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
      particles.push(new Particle(this.x, this.y, this.color, velocity));
    }
  }
  draw() {
    if (!this.exploded) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.color}, 100%, 70%)`;
      ctx.fill();
      ctx.restore();
    }
  }
}

// --- Main Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  // 1. Clear the canvas with a semi-transparent fill to create a trail effect
  ctx.fillStyle = `rgba(0, 0, 0, ${1 - controls.trailLength})`;
  ctx.fillRect(0, 0, width, height);

  // 2. Randomly launch new fireworks based on frequency
  if (random(0, 100) < controls.launchFreq / 10) {
    fireworks.push(new Firework());
  }

  // 3. Update and draw all active fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    // Remove the firework once it has exploded and its trail has faded
    if (fireworks[i].exploded && fireworks[i].trail.length === 0) {
      fireworks.splice(i, 1);
    }
  }

  // 4. Update and draw all explosion particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// --- Window Resize Handler ---
window.addEventListener("resize", () => {
  if (isRecording) return; // Prevent resizing during recording
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// --- Start the animation ---
window.onload = function () {
  setupToggleListener("resolution-toggle", "resolution", "resolution");
  setupToggleListener("framerate-toggle", "framerate", "framerate");
  animate();
};
