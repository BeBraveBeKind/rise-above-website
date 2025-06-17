// ENHANCED main.js - Fixed mobile navigation and button handling
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 main.js loaded successfully!');
  
  // Mobile menu toggle - ENHANCED with better state management
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  let menuOpen = false;
  
  if (menuToggle && navLinks) {
    // Toggle menu function
    function toggleMenu(forceClose = false) {
      if (forceClose || menuOpen) {
        // Close menu
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuOpen = false;
        console.log('📍 Menu closed');
      } else {
        // Open menu
        menuToggle.classList.add('active');
        navLinks.classList.add('active');
        menuOpen = true;
        console.log('🍔 Menu opened');
      }
    }
    
    // Menu toggle click
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      // Don't close if clicking inside nav or toggle
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && menuOpen) {
        toggleMenu(true);
      }
    });

    // Close on nav link click
    const navLinkElements = navLinks.querySelectorAll('a');
    navLinkElements.forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('🔗 Nav link clicked:', this.href);
        // Always close menu on link click
        toggleMenu(true);
        // Don't prevent default - let the link work normally
      });
    });
    
    // Prevent menu from closing when clicking inside it (except on links)
    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName !== 'A') {
        e.stopPropagation();
      }
    });
  }

  // ENHANCED: Button click handler for hero buttons
  document.addEventListener('click', function(e) {
    // Check if we clicked a button or link
    const clickedElement = e.target;
    const link = clickedElement.closest('a');
    const button = clickedElement.closest('.btn');
    
    // Log all button/link clicks for debugging
    if (button || link) {
      console.log('🔘 Button/Link clicked:', {
        element: button || link,
        href: (button || link).getAttribute('href'),
        classes: (button || link).className,
        tagName: (button || link).tagName
      });
    }
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Handle anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        console.log('✅ Scrolling to section:', targetId);
        scrollToElement(targetElement);
      } else {
        console.error('❌ Target section not found:', targetId);
      }
    } else if (href.includes('#') && !href.startsWith('http')) {
      // Cross-page anchor (like services.html#services-grid)
      console.log('📍 Cross-page navigation:', href);
      // Let browser handle it naturally
    }
  });
  
  // Enhanced scroll function with better offset calculation
  function scrollToElement(element) {
    const headerHeight = document.querySelector('header').offsetHeight || 120;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  // Handle hash on page load
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        console.log('📍 Scrolling to hash on load:', targetId);
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          scrollToElement(targetElement);
        }, 300);
      }
    }
  });
  
  // ENHANCED: Ensure hero buttons are clickable
  // Force pointer events on all buttons
  const allButtons = document.querySelectorAll('.btn, .btn-primary, .btn-light, .innovation-link');
  allButtons.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
    btn.style.position = 'relative';
    btn.style.zIndex = '999';
    
    // Add click handler for debugging
    btn.addEventListener('click', function(e) {
      console.log('✅ Button clicked successfully:', this.href || this.textContent);
    });
  });
  
  // Touch event support for mobile
  if ('ontouchstart' in window) {
    menuToggle?.addEventListener('touchstart', function(e) {
      e.preventDefault();
      toggleMenu();
    });
  }
  
  console.log('✅ main.js setup complete with enhanced handlers!');
});