// ENHANCED: Perfect smooth scrolling with history support
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 main.js loaded successfully!');
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
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
    const anchors = document.querySelectorAll('a[href^="#"]');
    console.log('🔗 Found', anchors.length, 'anchor links to setup');
    
    anchors.forEach(function(anchor, index) {
      console.log('Setting up anchor', index + 1, ':', anchor.getAttribute('href'), '"' + anchor.textContent.trim() + '"');
      
      // Remove any existing listeners to prevent duplicates
      anchor.removeEventListener('click', handleAnchorClick);
      anchor.addEventListener('click', handleAnchorClick);
    });
  }
  
  function handleAnchorClick(e) {
    console.log('🖱️ Button clicked:', this.textContent.trim(), 'href:', this.getAttribute('href'));
    e.preventDefault();
    
    let targetId = this.getAttribute('href');
    
    // Skip empty or just # links
    if (targetId === '#' || targetId === '') {
      console.log('⚠️ Empty href, skipping');
      return;
    }
    
    // Clean up the target ID
    if (targetId.includes('/#')) {
      targetId = targetId.split('/#')[1];
      targetId = '#' + targetId;
    }
    
    // Remove the # for querySelector
    const elementId = targetId.replace('#', '');
    
    console.log('🎯 Looking for element with ID:', elementId);
    
    // Find the target element
    const targetElement = document.getElementById(elementId) || document.querySelector(targetId);
    
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
  
  // Re-setup on dynamic content changes
  const observer = new MutationObserver(function(mutations) {
    let shouldResetup = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain anchor links
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.matches && node.matches('a[href^="#"]')) {
              shouldResetup = true;
            } else if (node.querySelector && node.querySelector('a[href^="#"]')) {
              shouldResetup = true;
            }
          }
        });
      }
    });
    
    if (shouldResetup) {
      console.log('🔄 Re-setting up smooth scrolling due to DOM changes');
      setupSmoothScrolling();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
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