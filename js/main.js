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

  // Smooth scrolling for anchor links - ENHANCED CROSS-PAGE SUPPORT
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
  
  // Handle cross-page navigation (e.g., /#contact from other pages)
  document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const targetId = href.substring(1); // Remove the leading slash
      
      // If we're not on the home page, navigate there
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        // Let the browser navigate to home page - the target will be handled by URL hash
        return; // Allow default behavior
      }
      
      // If we're already on home page, prevent default and scroll
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (menuToggle && menuToggle.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
        
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Handle URL hash on page load (for cross-page navigation)
  window.addEventListener('load', function() {
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure page is fully loaded
    }
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