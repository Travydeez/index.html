// Remove the original snow animation code and event listeners
// Only keep the GSAP-based snow system and related logic

// --- Snow Physics with GSAP ---
const SNOWFLAKES_PER_CLICK = () => Math.floor(Math.random() * 10) + 10; // 10-20 per click
const SNOWFLAKE_SIZE_MIN = 12;
const SNOWFLAKE_SIZE_MAX = 28;
const GRAVITY = 0.25;
const WIND_MAX = 1.2;
const SNOW_PILE_HEIGHT_LIMIT = 120; // px
const SNOW_PILE_TRIGGER_COUNT = 100;
let snowPileCount = 0;

// Pile array for stacking
const pileResolution = 4; // px per cell
let pileCells = Math.floor(window.innerWidth / pileResolution);
let snowPileArray = new Array(pileCells).fill(0);

document.addEventListener('click', createSnow);

function createSnow() {
  const count = SNOWFLAKES_PER_CLICK();
  for (let i = 0; i < count; i++) {
    spawnSnowflake();
  }
}

function spawnSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.innerHTML = '❄';
  snowflake.className = 'gsap-snowflake';
  const size = Math.random() * (SNOWFLAKE_SIZE_MAX - SNOWFLAKE_SIZE_MIN) + SNOWFLAKE_SIZE_MIN;
  snowflake.style.position = 'fixed';
  snowflake.style.left = Math.random() * window.innerWidth + 'px';
  snowflake.style.top = '-30px';
  snowflake.style.fontSize = size + 'px';
  snowflake.style.color = '#fff';
  snowflake.style.pointerEvents = 'none';
  snowflake.style.zIndex = '9999';
  document.body.appendChild(snowflake);

  // Physics
  const startX = parseFloat(snowflake.style.left);
  const drift = (Math.random() - 0.5) * WIND_MAX * 60; // px drift over fall
  const duration = Math.random() * 1.2 + 2.2; // seconds
  const endY = window.innerHeight - 40 - (Math.random() * 10);
  const endX = Math.max(0, Math.min(window.innerWidth - size, startX + drift));

  gsap.to(snowflake, {
    y: endY + 'px',
    x: endX - startX + 'px',
    ease: 'power1.in',
    duration: duration,
    onUpdate: function() {
      // Optionally, add a little sway
      snowflake.style.transform += ` rotate(${Math.sin(Date.now()/200 + startX) * 10}deg)`;
    },
    onComplete: function() {
      accumulateSnow(snowflake, endX, size);
    }
  });
}

function accumulateSnow(snowflake, x, size) {
  // Find pile cell
  const cell = Math.floor(x / pileResolution);
  // Find the lowest available spot in a gentle mound
  let min = snowPileArray[cell];
  let target = cell;
  for (let spread = 1; spread < 8; spread++) {
    for (let dir of [-1, 1]) {
      let idx = cell + dir * spread;
      if (idx >= 0 && idx < pileCells && snowPileArray[idx] < min) {
        min = snowPileArray[idx];
        target = idx;
      }
    }
  }
  // Place flake in pile
  const pile = document.getElementById('snowPile');
  const flake = document.createElement('div');
  flake.innerHTML = '❄';
  flake.className = 'gsap-snowflake';
  flake.style.position = 'absolute';
  flake.style.left = (target * pileResolution) + 'px';
  flake.style.bottom = (snowPileArray[target] * 8) + 'px';
  flake.style.fontSize = size + 'px';
  flake.style.color = '#fff';
  flake.style.pointerEvents = 'none';
  pile.appendChild(flake);
  snowPileArray[target] += 1;
  snowPileCount++;
  snowflake.remove();
  // Show cleanup button if needed
  maybeShowCleanup();
}

function maybeShowCleanup() {
  if (snowPileCount >= SNOW_PILE_TRIGGER_COUNT && !document.getElementById('cleanupBtn')) {
    showCleanupButton();
  }
}

function showCleanupButton() {
  const btn = document.createElement('button');
  btn.id = 'cleanupBtn';
  btn.textContent = 'Clean Up';
  btn.style.position = 'fixed';
  btn.style.left = '50%';
  btn.style.transform = 'translateX(-50%)';
  btn.style.bottom = '60px';
  btn.style.zIndex = '10000';
  btn.style.padding = '18px 40px';
  btn.style.fontSize = '1.2rem';
  btn.style.background = '#fff';
  btn.style.color = '#222';
  btn.style.border = 'none';
  btn.style.borderRadius = '30px';
  btn.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
  btn.style.cursor = 'pointer';
  btn.style.display = 'none';
  document.body.appendChild(btn);
  // Only show when pile is in view
  window.addEventListener('scroll', function checkPileInView() {
    const pile = document.getElementById('snowPile');
    if (!pile) return;
    const rect = pile.getBoundingClientRect();
    if (rect.bottom <= window.innerHeight && rect.top >= 0) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  });
  btn.addEventListener('click', startCleanupAnimation);
}

function startCleanupAnimation() {
  // TODO: Animate cartoon nose, snort snow pile away, play sound, reset state
  alert('Cleanup animation coming soon!');
}
