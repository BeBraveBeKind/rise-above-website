// RISE ABOVE PARTNERS - OPTIMIZED JAVASCRIPT
// Minimal, performance-focused implementation

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle - ESSENTIAL ONLY
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Smooth scrolling for anchor links - ESSENTIAL ONLY
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (menuToggle && menuToggle.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
        
        // Smooth scroll with performance optimization
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Performance: Passive scroll listener for better performance
  let ticking = false;
  
  function updateScrollEffects() {
    // Add any scroll-based effects here if needed
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
});