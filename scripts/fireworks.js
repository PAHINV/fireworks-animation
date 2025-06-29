import { random } from "./utils.js";

// --- Canvas & Context Setup ---
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

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

// --- Particle Class ---
class Particle {
  constructor(x, y, color, velocity, controls) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity || { x: 0, y: 0 };
    this.size = random(controls.sizeMin, controls.sizeMax);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
    this.controls = controls;
  }
  update() {
    this.x += this.velocity.x * this.controls.globalSpeed;
    this.y += this.velocity.y * this.controls.globalSpeed;
    this.velocity.y += this.controls.gravity * this.controls.globalSpeed;
    this.alpha -= this.decay * this.controls.globalSpeed;
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
class Firework {
  constructor(controls) {
    this.controls = controls;
    this.x = random(width * 0.2, width * 0.8);
    this.y = height;
    this.targetY = random(height * 0.2, height * 0.5);
    this.color = colors[Math.floor(random(0, colors.length))];
    this.velocity = { x: random(-1, 1), y: -this.controls.speed * 2.5 };
    this.trail = [];
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.x += this.velocity.x * this.controls.globalSpeed;
      this.y += this.velocity.y * this.controls.globalSpeed;
      this.trail.push(new Particle(this.x, this.y, this.color, undefined, this.controls));
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
    const particleCount = this.controls.particleCount;
    for (let i = 0; i < particleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 5);
      const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
      particles.push(new Particle(this.x, this.y, this.color, velocity, this.controls));
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

function drawText(controls) {
  if (controls.textOverlay) {
    ctx.save();
    const x = width * (controls.textX / 100);
    const y = height * (controls.textY / 100);
    ctx.font = `700 ${controls.fontSize}px ${controls.font}`;
    ctx.textAlign = controls.textAlign;

    ctx.fillStyle = controls.fontColor;
    ctx.globalAlpha = controls.textOpacity;
    const lines = controls.textOverlay.split("\n");
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * controls.fontSize);
    });

    ctx.restore();
  }
}

// --- Main Animation Loop ---
export function animate(controls) {
  requestAnimationFrame(() => animate(controls));

  // 1. Clear the canvas with a semi-transparent fill to create a trail effect
  ctx.fillStyle = `rgba(0, 0, 0, ${1 - controls.trailLength})`;
  ctx.fillRect(0, 0, width, height);

  // 2. Randomly launch new fireworks based on frequency
  if (random(0, 100) < controls.launchFreq / 10) {
    fireworks.push(new Firework(controls));
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

  // 5. Draw the text overlay
  drawText(controls);
}

// --- Window Resize Handler ---
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
