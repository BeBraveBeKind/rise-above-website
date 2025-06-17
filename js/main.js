// ENHANCED: Perfect smooth scrolling with history support
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 main.js loaded successfully!');
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      console.log('🍔 Menu toggle clicked');
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      // Check if click is outside menu and toggle
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
          console.log('📍 Clicked outside menu - closing');
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
      }
    });

    // Prevent clicks inside navLinks from closing the menu
    navLinks.addEventListener('click', function(e) {
      // Only close if clicking on a link, not the container
      if (e.target.tagName === 'A') {
        console.log('🔗 Nav link clicked - closing menu');
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ENHANCED: Perfect smooth scrolling with proper history management
  function smoothScrollToElement(targetElement, updateHistory = true) {
    if (!targetElement) return false;
    
    console.log('📍 Scrolling to element:', targetElement.id || targetElement.tagName);
    
    // Close mobile menu if open
    if (menuToggle && menuToggle.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
    
    // Calculate proper header height dynamically
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : (window.innerWidth <= 768 ? 84 : 100);
    const extraBuffer = 30; // Extra breathing room
    
    // Calculate target position
    const targetPosition = Math.max(0, targetElement.offsetTop - headerHeight - extraBuffer);
    
    // Update browser history if requested
    if (updateHistory && targetElement.id) {
      const newUrl = window.location.pathname + window.location.search + '#' + targetElement.id;
      window.history.pushState({scrollTop: window.pageYOffset}, '', newUrl);
    }
    
    // Perform smooth scroll
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    console.log('✓ Smooth scroll to:', targetElement.id || targetElement.tagName, 'Position:', targetPosition);
    return true;
  }
  
  // Setup smooth scrolling for all anchor links
  function setupSmoothScrolling() {
    // Use event delegation for better performance and dynamic content
    document.addEventListener('click', function(e) {
      // Find the closest anchor tag (in case we clicked on something inside the anchor)
      const anchor = e.target.closest('a[href^="#"]');
      
      if (!anchor) return;
      
      console.log('🖱️ Anchor clicked:', anchor.textContent.trim(), 'href:', anchor.getAttribute('href'));
      
      const targetId = anchor.getAttribute('href');
      
      // Skip empty or just # links
      if (targetId === '#' || targetId === '') {
        console.log('⚠️ Empty href, skipping');
        return;
      }
      
      // Prevent default behavior
      e.preventDefault();
      
      // Clean up the target ID
      let elementId = targetId;
      if (targetId.includes('/#')) {
        elementId = targetId.split('/#')[1];
        elementId = '#' + elementId;
      }
      
      // Remove the # for querySelector
      elementId = elementId.replace('#', '');
      
      console.log('🎯 Looking for element with ID:', elementId);
      
      // Find the target element
      const targetElement = document.getElementById(elementId) || document.querySelector('#' + elementId);
      
      if (targetElement) {
        console.log('✅ Found target element:', targetElement.tagName, 'id="' + targetElement.id + '"');
        smoothScrollToElement(targetElement, true);
      } else {
        console.warn('❌ Target element not found:', targetId);
        
        // Try alternative selectors as fallback
        const alternatives = [
          `[data-section="${elementId}"]`,
          `[name="${elementId}"]`,
          `.${elementId}`
        ];
        
        for (let selector of alternatives) {
          const altElement = document.querySelector(selector);
          if (altElement) {
            console.log('✅ Found alternative target:', selector);
            smoothScrollToElement(altElement, true);
            return;
          }
        }
        
        console.log('💡 Available elements with IDs:');
        document.querySelectorAll('[id]').forEach(el => {
          console.log('  - #' + el.id, '(' + el.tagName + ')');
        });
      }
    });
  }
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    if (event.state && typeof event.state.scrollTop === 'number') {
      // Restore previous scroll position without updating history
      setTimeout(() => {
        window.scrollTo({
          top: event.state.scrollTop,
          behavior: 'smooth'
        });
      }, 50);
    } else if (window.location.hash) {
      // Navigate to hash without updating history
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          smoothScrollToElement(targetElement, false);
        }, 50);
      }
    }
  });
  
  // Initialize smooth scrolling
  console.log('🔧 Setting up smooth scrolling...');
  setupSmoothScrolling();
  
  // Handle page load with hash
  if (window.location.hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        smoothScrollToElement(targetElement, false);
      }
    }, 500); // Wait for page to fully load
  }
  
  // Debug function (can be called from console)
  window.debugSections = function() {
    console.log('=== AVAILABLE SECTIONS ===');
    const allIds = document.querySelectorAll('[id]');
    allIds.forEach(el => {
      console.log('✓ #' + el.id, '(' + el.tagName + ')', 'Offset:', el.offsetTop);
    });
    
    const allAnchors = document.querySelectorAll('a[href^="#"]');
    console.log('\n=== ANCHOR LINKS ===');
    allAnchors.forEach(anchor => {
      console.log('→', anchor.getAttribute('href'), '(' + anchor.textContent.trim().substring(0, 30) + '...)');
    });
    console.log('========================');
  };
  
  // Run initial debug
  console.log('🔍 Running initial debug...');
  window.debugSections();
  
  console.log('✅ main.js setup complete!');
});