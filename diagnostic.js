// Animation Diagnostic Script
// Run this in browser console to check what's happening

console.log('🔍 Animation Diagnostic Starting...');

// Check if animations are supported
const animationSupport = {
    cssAnimations: 'animation' in document.body.style,
    cssTransforms: 'transform' in document.body.style,
    cssTransitions: 'transition' in document.body.style
};

console.log('✅ Browser Support:');
console.log('- CSS Animations:', animationSupport.cssAnimations);
console.log('- CSS Transforms:', animationSupport.cssTransforms);
console.log('- CSS Transitions:', animationSupport.cssTransitions);

// Check if animations are disabled in browser
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
console.log('🚫 Reduced Motion Preference:', mediaQuery.matches);

// Check if any CSS is loaded
const styleSheets = document.styleSheets;
console.log('📄 Number of stylesheets loaded:', styleSheets.length);

// Check for floating shapes
const shapes = document.querySelectorAll('.shape');
console.log('🔷 Number of floating shapes found:', shapes.length);

// Check for wave overlay
const wave = document.querySelector('.wave-overlay');
console.log('🌊 Wave overlay found:', !!wave);

// Check z-index of elements
if (shapes.length > 0) {
    const firstShape = shapes[0];
    const computedStyle = window.getComputedStyle(firstShape);
    console.log('🔷 First shape z-index:', computedStyle.zIndex);
    console.log('🔷 First shape opacity:', computedStyle.opacity);
    console.log('🔷 First shape position:', computedStyle.position);
}

// Test creating a simple animated element
function testSimpleAnimation() {
    console.log('🧪 Testing simple animation creation...');
    
    const testDiv = document.createElement('div');
    testDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        background: red;
        z-index: 9999;
        animation: testPulse 1s infinite;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes testPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(2); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(testDiv);
    
    console.log('✅ Test animation element created!');
    console.log('You should see a red square pulsing in the center of the screen.');
    
    // Remove after 5 seconds
    setTimeout(() => {
        testDiv.remove();
        style.remove();
        console.log('🧹 Test animation cleaned up.');
    }, 5000);
}

// Make functions available globally
window.AnimationDiagnostic = {
    testSimpleAnimation,
    animationSupport,
    shapes: shapes.length,
    wave: !!wave
};

console.log('🎯 Diagnostic complete!');
console.log('Run AnimationDiagnostic.testSimpleAnimation() to test basic animation creation.'); 