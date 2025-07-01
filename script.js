// Create snow effect when clicked
document.addEventListener('click', function() {
  createSnow();
});

function createSnow() {
  for (let i = 0; i < 50; i++) {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄';
    snowflake.style.position = 'fixed';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.top = '-20px';
    snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';
    snowflake.style.color = '#fff';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.zIndex = '9999';
    snowflake.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
    
    document.body.appendChild(snowflake);
    
    // Remove snowflake after animation
    setTimeout(() => {
      snowflake.remove();
    }, 5000);
  }
}

// Add CSS animation for falling snow
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
  const miniTitle = document.getElementById('mini-title');
  if (miniTitle) {
    miniTitle.style.cursor = 'pointer';
    miniTitle.addEventListener('click', function() {
      // Remove all animation classes
      miniTitle.classList.remove('mini-shrink', 'mini-wiggle', 'mini-pop');
      // Start shrink
      miniTitle.classList.add('mini-shrink');
      setTimeout(() => {
        miniTitle.classList.remove('mini-shrink');
        miniTitle.classList.add('mini-wiggle');
        setTimeout(() => {
          miniTitle.classList.remove('mini-wiggle');
          miniTitle.classList.add('mini-pop');
          setTimeout(() => {
            miniTitle.classList.remove('mini-pop');
          }, 400);
        }, 2000);
      }, 2000);
    });
  }
});
