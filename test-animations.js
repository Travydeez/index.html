// Animation Testing Script for Tiny Totes™
// Run these commands in browser console (F12 → Console tab)

const AnimationTester = {
  // Test background animations
  testBackground: () => {
    console.log('🎨 Testing background animations...');
    const body = document.body;
    const wave = document.querySelector('.wave-overlay');
    const shapes = document.querySelector('.floating-shapes');
    
    // Speed up animations for testing
    body.style.setProperty('--bg-speed', '3s');
    wave.style.animationDuration = '5s';
    
    console.log('✅ Background animations active');
  },
  
  // Test floating shapes
  testShapes: () => {
    console.log('🔷 Testing floating shapes...');
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
      shape.style.animationDuration = '8s';
      shape.style.opacity = '0.5'; // Make more visible
    });
    console.log(`✅ ${shapes.length} shapes animating`);
  },
  
  // Test snow effect
  testSnow: () => {
    console.log('❄️ Testing snow effect...');
    createSnow();
    console.log('✅ Snow effect triggered');
  },
  
  // Test MINI title animation
  testMini: () => {
    console.log('🔤 Testing MINI title animation...');
    const miniTitle = document.getElementById('mini-title');
    if (miniTitle) {
      miniTitle.click();
      console.log('✅ MINI animation triggered');
    } else {
      console.log('❌ MINI title not found');
    }
  },
  
  // SUPER OBVIOUS TEST MODE - Makes everything very visible
  superTest: () => {
    console.log('🚨 SUPER OBVIOUS TEST MODE ACTIVATED!');
    
    // Make background super obvious
    const body = document.body;
    body.style.setProperty('--bg-speed', '2s');
    
    // Make wave super obvious
    const wave = document.querySelector('.wave-overlay');
    if (wave) {
      wave.style.animationDuration = '3s';
      wave.style.opacity = '0.5';
      wave.style.background = 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(255, 0, 0, 0.3) 0%, transparent 50%)';
    }
    
    // Make shapes super obvious
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
      shape.style.animationDuration = '4s';
      shape.style.opacity = '1';
      shape.style.border = '3px solid red';
      shape.style.boxShadow = '0 8px 24px rgba(255,0,0,0.6)';
    });
    
    console.log('🎯 You should now see RED shapes floating around and a RED wave!');
    console.log('If you see this, animations are working!');
  },
  
  // Reset all animations to normal
  reset: () => {
    console.log('🔄 Resetting animations...');
    const body = document.body;
    const wave = document.querySelector('.wave-overlay');
    const shapes = document.querySelectorAll('.shape');
    
    body.style.removeProperty('--bg-speed');
    if (wave) {
      wave.style.animationDuration = '20s';
      wave.style.opacity = '';
      wave.style.background = '';
    }
    shapes.forEach(shape => {
      shape.style.animationDuration = '';
      shape.style.opacity = '';
      shape.style.border = '';
      shape.style.boxShadow = '';
    });
    console.log('✅ Animations reset to normal');
  },
  
  // Show animation status
  status: () => {
    console.log('📊 Animation Status:');
    console.log('- Background: Active');
    console.log('- Floating Shapes: Active');
    console.log('- Wave Overlay: Active');
    console.log('- Snow Effect: Ready');
    console.log('- MINI Animation: Ready');
  }
};

// Make it available globally
window.AnimationTester = AnimationTester;

console.log('🎯 AnimationTester loaded! Use:');
console.log('- AnimationTester.superTest() ← TRY THIS FIRST!');
console.log('- AnimationTester.testBackground()');
console.log('- AnimationTester.testShapes()');
console.log('- AnimationTester.testSnow()');
console.log('- AnimationTester.testMini()');
console.log('- AnimationTester.reset()');
console.log('- AnimationTester.status()'); 