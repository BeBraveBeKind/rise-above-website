/**
 * Browser Compatibility and Bug Fixes
 * Rise Above Partners - Complete JavaScript Fixes
 */

// ============================================
// 1. POLYFILLS FOR OLDER BROWSERS
// ============================================

// NodeList.forEach polyfill for IE11
if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Element.closest polyfill
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// ============================================
// 2. CROSS-BROWSER SMOOTH SCROLL
// ============================================

function smoothScrollPolyfill() {
  // Check if smooth scroll is supported
  const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  
  if (!supportsNativeSmoothScroll) {
    // Implement smooth scroll for browsers that don't support it
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight || 84;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        // Manual smooth scroll animation
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
      }
    });
  }
}

// ============================================
// 3. MOBILE TOUCH IMPROVEMENTS
// ============================================

function improveTouchTargets() {
  // Only run on touch devices
  if (!('ontouchstart' in window)) return;
  
  // Add touch feedback to all buttons
  const buttons = document.querySelectorAll('.btn, button, .filter-tag, .faq-toggle');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    });
    
    button.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.opacity = '';
      }, 100);
    });
  });
  
  // Prevent double-tap zoom on buttons
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}

// ============================================
// 4. FIX SAFARI BACKDROP FILTER
// ============================================

function fixSafariBackdrop() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    // Add Safari class for CSS targeting
    document.body.classList.add('safari');
    
    // Force repaint on elements with backdrop-filter
    const elements = document.querySelectorAll('.hero-overlay, .grant-card, .filter-tag');
    elements.forEach(el => {
      el.style.transform = 'translateZ(0)';
    });
  }
}

// ============================================
// 5. FIX MOBILE MENU ISSUES
// ============================================

function fixMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;
  
  if (!menuToggle || !navLinks) return;
  
  // Improved menu toggle with body scroll lock
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isActive = menuToggle.classList.contains('active');
    
    if (!isActive) {
      menuToggle.classList.add('active');
      navLinks.classList.add('active');
      body.style.overflow = 'hidden'; // Prevent body scroll
    } else {
      closeMenu();
    }
  });
  
  // Close menu function
  function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    body.style.overflow = ''; // Restore body scroll
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
  
  // Close menu when clicking nav links
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ============================================
// 6. FIX BUTTON CLICK RELIABILITY
// ============================================

function ensureButtonClicks() {
  // Add fallback click handlers for all buttons
  const buttons = document.querySelectorAll('.btn, button, a[class*="btn"]');
  
  buttons.forEach(button => {
    // Remove any blocking elements
    button.style.position = 'relative';
    button.style.zIndex = '10';
    
    // Add backup click handler
    if (button.tagName === 'A' && button.href) {
      button.addEventListener('click', function(e) {
        // Only prevent default if it's an anchor link
        if (this.getAttribute('href').startsWith('#')) {
          // Let smooth scroll handle it
          return;
        }
        // For external links, ensure they work
        if (this.target === '_blank') {
          e.preventDefault();
          window.open(this.href, '_blank');
        }
      });
    }
  });
}

// ============================================
// 7. FIX GRANT CARDS LOADING
// ============================================

function monitorGrantLoading() {
  const container = document.getElementById('grants-container');
  if (!container) return;
  
  // Add timeout for grant loading
  let loadingTimeout = setTimeout(() => {
    if (container.querySelector('.loading-container')) {
      console.warn('Grants taking long to load');
      // Show timeout message
      const loadingContainer = container.querySelector('.loading-container');
      if (loadingContainer) {
        const message = loadingContainer.querySelector('p');
        if (message) {
          message.textContent = 'Still loading... Please wait or refresh the page.';
        }
      }
    }
  }, 5000);
  
  // Clear timeout if grants load
  const observer = new MutationObserver((mutations) => {
    if (container.querySelector('.grant-card')) {
      clearTimeout(loadingTimeout);
      observer.disconnect();
    }
  });
  
  observer.observe(container, { childList: true, subtree: true });
}

// ============================================
// 8. VIEWPORT HEIGHT FIX FOR MOBILE
// ============================================

function fixViewportHeight() {
  // Fix for mobile browsers with dynamic viewport height
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
}

// ============================================
// 9. IMAGE LOADING OPTIMIZATION
// ============================================

function optimizeImageLoading() {
  // Check WebP support
  function checkWebPSupport(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
      callback(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }
  
  checkWebPSupport(function(supported) {
    if (!supported) {
      // Fallback to JPG for browsers that don't support WebP
      document.body.classList.add('no-webp');
    }
  });
  
  // Lazy load images with Intersection Observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// 10. PERFORMANCE MONITORING
// ============================================

function monitorPerformance() {
  // Log performance metrics
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        console.log('Page Performance:', {
          'Total Load Time': loadTime + 'ms',
          'DOM Ready': domReady + 'ms',
          'First Paint': performance.getEntriesByType('paint')[0]?.startTime + 'ms'
        });
        
        // Warn if load time is too slow
        if (loadTime > 3000) {
          console.warn('Page load time exceeds 3 seconds');
        }
      }, 0);
    });
  }
}

// ============================================
// INITIALIZE ALL FIXES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Apply all fixes
  smoothScrollPolyfill();
  improveTouchTargets();
  fixSafariBackdrop();
  fixMobileMenu();
  ensureButtonClicks();
  monitorGrantLoading();
  fixViewportHeight();
  optimizeImageLoading();
  
  // Only monitor performance in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorPerformance();
  }
});

// Handle dynamic content
if (window.MutationObserver) {
  const observer = new MutationObserver(function(mutations) {
    // Reapply button fixes for dynamically added content
    ensureButtonClicks();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

console.log('Browser fixes loaded successfully');