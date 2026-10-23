/**
 * MAJE TECHNOLOGIES — BOUTIQUE STUDIO INTERACTIONS
 * Live Studio Clocks • Magnetic Parallax • Bento Glow
 */

(function () {
  'use strict';

  // 1. LIVE INTERNATIONAL STUDIO CLOCKS (Rajkot HQ, New York, London, Dubai)
  function initStudioClocks() {
    const timezones = {
      rajkot: 'Asia/Kolkata',
      ny: 'America/New_York',
      london: 'Europe/London',
      dubai: 'Asia/Dubai'
    };

    function updateClocks() {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };

      try {
        const elRajkot = document.getElementById('clock-rajkot');
        const elNy = document.getElementById('clock-ny');
        const elLondon = document.getElementById('clock-london');
        const elDubai = document.getElementById('clock-dubai');

        if (elRajkot) {
          elRajkot.textContent = new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezones.rajkot }).format(now);
        }
        if (elNy) {
          elNy.textContent = new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezones.ny }).format(now);
        }
        if (elLondon) {
          elLondon.textContent = new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezones.london }).format(now);
        }
        if (elDubai) {
          elDubai.textContent = new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezones.dubai }).format(now);
        }
      } catch (err) {
        console.warn('Clock update error:', err);
      }
    }

    updateClocks();
    setInterval(updateClocks, 1000);
  }

  // 2. MAGNETIC DUAL PARALLAX HEADLINE (two26.studio Reverse Engineering)
  function initMagneticParallax() {
    const headline = document.getElementById('magneticHeadline');
    const accentLine = document.querySelector('.headline-accent');
    if (!headline || !accentLine) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;

    window.addEventListener('mousemove', function (e) {
      const rect = headline.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance relative to center
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Max offset in pixels (subtle, high-end feel)
      targetX = deltaX * 10;
      targetY = deltaY * 6;
      isHovering = true;
    });

    window.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
    });

    // Smooth lerp loop
    function renderParallax() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      accentLine.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

  // 3. NAVBAR SCROLL GLASSMORPHISM
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 4. BENTO CARDS MOUSE SPOTLIGHT GLOW
  function initCardSpotlight() {
    const cards = document.querySelectorAll('.service-card, .value-card-horizontal, .hero-interactive-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // Initialize all on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initStudioClocks();
    initMagneticParallax();
    initNavbarScroll();
    initCardSpotlight();
  }
})();
