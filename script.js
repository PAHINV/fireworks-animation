// --- Canvas & Context Setup ---
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// --- Global Control Variables ---
let controls = {
  launchFreq: 20,
  gravity: 0.02,
  trailLength: 0.1,
  speed: 2,
  sizeMin: 1,
  sizeMax: 3
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
    const value = parseFloat(slider.value) * multiplier;
    controls[property] = value;
    valueDisplay.textContent = value.toFixed(fixed);
  });
};

setupControlListener("launch-freq", "launchFreq", "launch-freq-value", 1, 0);
setupControlListener("gravity", "gravity", "gravity-value", 0.01, 2);
setupControlListener("trail-length", "trailLength", "trail-length-value", 0.01, 2);
setupControlListener("speed", "speed", "speed-value", 1, 1);
setupControlListener("size-min", "sizeMin", "size-min-value", 1, 1);
setupControlListener("size-max", "sizeMax", "size-max-value", 1, 1);

// --- Particle Class ---
// Represents a single point of light, used for both rocket trails and explosion effects.
class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity || { x: 0, y: 0 };
    this.size = random(controls.sizeMin, controls.sizeMax);
    this.alpha = 1;
    this.decay = random(0.015, 0.03); // How fast the particle fades
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += controls.gravity; // Apply gravity
    this.alpha -= this.decay;
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
    this.startX = this.x;
    this.startY = height;
    this.targetY = random(height * 0.2, height * 0.5);
    this.color = colors[Math.floor(random(0, colors.length))];
    this.velocity = { x: random(-1, 1), y: -controls.speed * 2.5 };
    this.trail = [];
    this.exploded = false;
  }

  update() {
    // If not exploded, move upwards and create a trail
    if (!this.exploded) {
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Add trail particles
      this.trail.push(new Particle(this.x, this.y, this.color));

      // Check if it's time to explode
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.explode();
      }
    }

    // Update all trail particles
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].update();
      this.trail[i].draw();
      if (this.trail[i].alpha <= 0) {
        this.trail.splice(i, 1);
      }
    }
  }

  explode() {
    const particleCount = random(100, 200);
    for (let i = 0; i < particleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 5);
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
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
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// --- Start the animation ---
window.onload = function () {
  animate();
};
