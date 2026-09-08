/* ==========================================
   ANIMATIONS.JS - Three.js Particle Background
   + Advanced Animations
   ========================================== */

'use strict';

// =============================================
// PROFESSIONAL AURORA GRADIENT BACKGROUND
// =============================================
function initAuroraBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let time = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  window.addEventListener('resize', resize);
  resize();

  // Subtle professional colors
  const colorDark = { r: 5, g: 5, b: 5 }; // Almost black
  const colorAccent1 = { r: 212, g: 175, b: 55 }; // Gold
  const colorAccent2 = { r: 255, g: 255, b: 255 }; // White

  // Mouse interaction variables
  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetX = width / 2;
  let targetY = height / 2;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function draw() {
    time += 0.002; // Very slow and smooth animation
    
    // Smooth mouse follow
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Clear background
    ctx.fillStyle = `rgb(${colorDark.r}, ${colorDark.g}, ${colorDark.b})`;
    ctx.fillRect(0, 0, width, height);

    // Create moving orbs/blobs
    const blobs = [
      {
        x: width * 0.3 + Math.sin(time) * 200,
        y: height * 0.4 + Math.cos(time * 0.8) * 200,
        r: Math.min(width, height) * 0.6,
        color: `rgba(${colorAccent1.r}, ${colorAccent1.g}, ${colorAccent1.b}, 0.15)`
      },
      {
        x: width * 0.7 + Math.sin(time * 1.2) * 250,
        y: height * 0.6 + Math.cos(time * 0.9) * 250,
        r: Math.min(width, height) * 0.6,
        color: `rgba(${colorAccent2.r}, ${colorAccent2.g}, ${colorAccent2.b}, 0.12)`
      },
      { // Mouse follower orb
        x: mouseX,
        y: mouseY,
        r: Math.min(width, height) * 0.4,
        color: `rgba(${colorAccent1.r}, ${colorAccent1.g}, ${colorAccent1.b}, 0.08)`
      }
    ];

    blobs.forEach(blob => {
      const gradient = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.r
      );
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add noise/grain texture overlaid on top
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Very subtle grain loop (optimize heavily or use CSS filter)
    // For performance, we skip pixel noise here and rely on CSS backdrop filters
    
    requestAnimationFrame(draw);
  }

  draw();
}

// =============================================
// FLOATING GEOMETRIC SHAPES (Disabled)
// =============================================
function initFloatingShapes() {
  return;
}

// =============================================
// SECTION ENTRANCE ANIMATIONS (GSAP-style)
// =============================================
function initSectionAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const delay = section.getAttribute('data-delay') || 0;
        setTimeout(() => {
          section.querySelector('.section-header')?.classList.add('active');
        }, delay);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(s => {
    if (s.querySelector('.section-header')) observer.observe(s);
  });
}

// =============================================
// GLOBAL SCROLL REVEALS
// =============================================
// =============================================
// GLOBAL SCROLL REVEALS
// =============================================
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .cert-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed if you only want it to animate once
        // observer.unobserve(entry.target); 
      } else {
        // Remove this else block if you want the animation to happen only once
        // Keep it if you want elements to hide and re-reveal when scrolling up/down
        entry.target.classList.remove('active');
      }
    });
  }, { 
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before the bottom of the viewport
  });

  revealElements.forEach(el => observer.observe(el));
}

// =============================================
// CARD STAGGER ANIMATIONS
// =============================================
function initCardStagger() {
  const grids = document.querySelectorAll('.projects-grid, .skills-grid, .certs-grid');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.project-card, .skill-card, .cert-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  grids.forEach(g => observer.observe(g));
}


document.addEventListener('DOMContentLoaded', () => {
  initAuroraBackground();

  initFloatingShapes();
  initSectionAnimations();
  initScrollReveals();
  initCardStagger();
});

// Also run when loading screen ends
window.addEventListener('load', () => {
  setTimeout(() => {
    initSectionAnimations();
    initScrollReveals();
    initCardStagger();
  }, 3000);
});
