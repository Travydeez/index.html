// --- Full-Page Canvas Snow Animation with Piling and Cleanup ---
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let snowflakes = [];
let landedFlakes = [];
const SNOWFLAKES_PER_CLICK = () => Math.floor(Math.random() * 10) + 10;
const SNOWFLAKE_SIZE_MIN = 8;
const SNOWFLAKE_SIZE_MAX = 18;
const GRAVITY = 0.015; // much gentler gravity
const WIND_BASE = 0.18; // gentler base wind
const WIND_VARIANCE = 0.12; // gentler wind variance
const PILE_TOLERANCE = 0.8;
const PILE_HEIGHT_THRESHOLD = 120;
const PILE_PHYSICS = true; // enable pile physics
let showCleanup = false;
let noseAnimating = false;
let windTime = 0;

// Add a snort sound (optional, use a placeholder if not present)
let snortAudio = new Audio('assets/snort.mp3'); // Place your snort sound in assets/

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getGlobalWind() {
  // Smoothly varying wind using sine waves
  windTime += 0.002; // slower wind changes
  return Math.sin(windTime) * WIND_BASE + Math.sin(windTime * 0.37) * WIND_VARIANCE;
}

function spawnSnowflakes() {
  const count = SNOWFLAKES_PER_CLICK();
  for (let i = 0; i < count; i++) {
    const size = Math.random() * (SNOWFLAKE_SIZE_MAX - SNOWFLAKE_SIZE_MIN) + SNOWFLAKE_SIZE_MIN;
    const x = Math.random() * (canvas.width - size) + size / 2;
    const y = -size;
    const vx = (Math.random() - 0.5) * 0.08; // gentler random drift
    const vy = Math.random() * 0.08 + 0.08; // much slower initial fall
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.008;
    snowflakes.push({ x, y, vx, vy, r: size / 2, rotation, rotationSpeed, landed: false });
  }
}
document.addEventListener('click', spawnSnowflakes);

function checkCollision(flake) {
  // Check collision with landed flakes
  for (let other of landedFlakes) {
    const dx = flake.x - other.x;
    const dy = (flake.y + flake.r) - (other.y - other.r);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dx) < (flake.r + other.r) * PILE_TOLERANCE &&
        Math.abs(flake.y + flake.r - (other.y - other.r)) < 2 &&
        dy > 0 && dist < (flake.r + other.r) * 1.2) {
      return true;
    }
  }
  // Check collision with bottom
  if (flake.y + flake.r >= canvas.height) {
    return true;
  }
  return false;
}

function updatePilePhysics() {
  if (!PILE_PHYSICS) return;
  
  // Weight-based physics: let flakes settle under their own weight
  for (let i = landedFlakes.length - 1; i >= 0; i--) {
    let flake = landedFlakes[i];
    let moved = false;
    
    // Check if flake can fall further under its weight
    let canFall = true;
    let supportFound = false;
    
    for (let other of landedFlakes) {
      if (other === flake) continue;
      const dx = flake.x - other.x;
      const dy = (flake.y + flake.r) - (other.y - other.r);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Check for support below
      if (Math.abs(dx) < (flake.r + other.r) * 0.8 && dy > 0 && dy < flake.r + other.r + 2) {
        canFall = false;
        supportFound = true;
        break;
      }
    }
    
    // If no support found and not at bottom, let it fall
    if (canFall && !supportFound && flake.y + flake.r < canvas.height) {
      flake.y += 0.3; // gentle settling
      moved = true;
    }
    
    // Minimal horizontal settling (much less than before)
    if (!moved && Math.random() < 0.1) { // 10% chance per frame
      let leftSpace = true;
      let rightSpace = true;
      
      for (let other of landedFlakes) {
        if (other === flake) continue;
        const dx = flake.x - other.x;
        const dy = flake.y - other.y;
        if (Math.abs(dx) < flake.r + other.r && Math.abs(dy) < flake.r + other.r) {
          if (dx > 0) leftSpace = false;
          if (dx < 0) rightSpace = false;
        }
      }
      
      // Very gentle settling to the side
      if (leftSpace && flake.x > flake.r) {
        flake.x -= 0.1;
      } else if (rightSpace && flake.x < canvas.width - flake.r) {
        flake.x += 0.1;
      }
    }
  }
}

function updateSnow() {
  const globalWind = getGlobalWind();
  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let f = snowflakes[i];
    if (!f.landed) {
      f.vy += GRAVITY * (0.8 + Math.random() * 0.4); // gentler per-flake variation
      f.x += f.vx + globalWind + Math.sin(f.y / 60 + f.x / 100) * 0.12; // gentler horizontal motion
      f.y += f.vy;
      f.rotation += f.rotationSpeed + Math.sin(f.y / 80) * 0.008;
      // Clamp to canvas
      f.x = Math.max(f.r, Math.min(canvas.width - f.r, f.x));
      // Collision check
      if (checkCollision(f)) {
        f.landed = true;
        landedFlakes.push(f);
        snowflakes.splice(i, 1);
      }
    }
  }
  
  // Update pile physics
  updatePilePhysics();
}

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw falling snowflakes
  for (let f of snowflakes) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, f.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.98;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  // Draw landed snowflakes (the pile)
  for (let f of landedFlakes) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, f.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.98;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function snowLoop() {
  if (!noseAnimating) {
    updateSnow();
  }
  drawSnow();
  // Show cleanup button if pile is tall enough (always visible)
  let maxPile = 0;
  if (landedFlakes.length > 0) {
    // Find the highest point of the snow pile (lowest y value)
    maxPile = canvas.height - Math.min(...landedFlakes.map(f => f.y - f.r));
  }
  
  // Debug logging
  console.log(`Pile height: ${maxPile}, Threshold: ${PILE_HEIGHT_THRESHOLD}, Landed flakes: ${landedFlakes.length}`);
  
  if (maxPile > PILE_HEIGHT_THRESHOLD && !showCleanup) {
    showCleanup = true;
    showCleanupButton();
    console.log('Showing cleanup button!');
  }
  if (maxPile <= PILE_HEIGHT_THRESHOLD && showCleanup) {
    // Hide button if pile shrinks
    document.getElementById('cleanupBtn')?.remove();
    showCleanup = false;
    console.log('Hiding cleanup button');
  }
  requestAnimationFrame(snowLoop);
}
snowLoop();

function showCleanupButton() {
  if (document.getElementById('cleanupBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'cleanupBtn';
  btn.textContent = 'Clean Up';
  btn.style.position = 'fixed';
  btn.style.right = '32px';
  btn.style.bottom = '32px';
  btn.style.zIndex = '10000';
  btn.style.padding = '14px 28px';
  btn.style.fontSize = '1rem';
  btn.style.background = '#fff';
  btn.style.color = '#222';
  btn.style.border = 'none';
  btn.style.borderRadius = '24px';
  btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
  btn.style.cursor = 'pointer';
  btn.style.fontFamily = 'Inter, sans-serif';
  btn.style.fontWeight = '600';
  btn.style.transition = 'background 0.2s, color 0.2s';
  btn.style.outline = 'none';
  btn.style.backgroundClip = 'padding-box';
  btn.style.opacity = '0.98';
  btn.style.display = 'inline-block';
  btn.style.pointerEvents = 'auto';
  document.body.appendChild(btn);
  btn.addEventListener('click', startCleanupAnimation);
}

function startCleanupAnimation() {
  if (noseAnimating) return;
  noseAnimating = true;
  const nose = document.createElement('img');
  nose.src = 'assets/Nose.png'; // Use the new PNG file
  nose.id = 'nose-anim';
  nose.style.position = 'fixed';
  nose.style.left = '-180px';
  nose.style.bottom = '0px';
  nose.style.width = '140px';
  nose.style.zIndex = '10001';
  nose.style.transition = 'none';
  nose.style.pointerEvents = 'none';
  nose.style.background = 'transparent'; // Remove any white box
  nose.style.boxShadow = 'none'; // Remove any box shadow
  document.body.appendChild(nose);

  // Play snort sound
  if (snortAudio) {
    snortAudio.currentTime = 0;
    snortAudio.volume = 0.7;
    snortAudio.play();
  }

  // Animation state
  let start = null;
  let duration = 4000; // 4 seconds
  let bobbing = true;
  let residueParticles = [];
  let nostrilOffsetX = 70; // px from left of nose image
  let nostrilOffsetY = 90; // px from top of nose image
  let noseWidth = 140;
  let noseHeight = 140;

  function animateNose(ts) {
    if (!start) start = ts;
    let elapsed = ts - start;
    let progress = Math.min(elapsed / duration, 1);
    // Nose horizontal position
    let left = -noseWidth + (window.innerWidth + noseWidth) * progress;
    nose.style.left = left + 'px';
    // Bobbing motion (first 0.5s)
    let bob = 0;
    if (elapsed < 600) {
      bob = Math.sin((elapsed / 600) * Math.PI) * 30;
    }
    nose.style.bottom = bob + 'px';
    // Nose nostril center (for suction)
    let nostrilX = left + nostrilOffsetX;
    let nostrilY = window.innerHeight - noseHeight + nostrilOffsetY + bob;
    // Suction snowflakes
    for (let i = landedFlakes.length - 1; i >= 0; i--) {
      let f = landedFlakes[i];
      let dx = nostrilX - f.x;
      let dy = nostrilY - f.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        // Easing pull
        f.x += dx * 0.18;
        f.y += dy * 0.18;
        f.r *= 0.85;
        // Leave residue at nostril
        if (f.r < 2.5) {
          residueParticles.push({ x: nostrilX + (Math.random() - 0.5) * 12, y: nostrilY + (Math.random() - 0.5) * 8, r: Math.random() * 3 + 2, alpha: 1 });
          landedFlakes.splice(i, 1);
        }
      }
    }
    // Fade out residue
    for (let p of residueParticles) {
      p.alpha *= 0.97;
      p.r *= 0.98;
    }
    residueParticles = residueParticles.filter(p => p.alpha > 0.1);
    // Draw residue on canvas
    drawResidue(residueParticles);
    if (progress < 1) {
      requestAnimationFrame(animateNose);
    } else {
      // End: fade out nose, residue, reset
      nose.style.transition = 'left 0.5s';
      nose.style.left = window.innerWidth + 200 + 'px';
      setTimeout(() => {
        nose.remove();
        document.getElementById('cleanupBtn')?.remove();
        landedFlakes = [];
        showCleanup = false;
        noseAnimating = false;
        residueParticles = [];
        drawResidue(residueParticles);
        if (snortAudio) snortAudio.pause();
      }, 600);
    }
  }
  requestAnimationFrame(animateNose);
}

function drawResidue(residueParticles) {
  // Draw residue on top of snow pile
  ctx.save();
  for (let p of residueParticles) {
    ctx.globalAlpha = p.alpha * 0.7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.shadowColor = '#bbb';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
