// ENHANCED: Comprehensive JavaScript with improved anchor link handling
document.addEventListener('DOMContentLoaded', function() {
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

  // ENHANCED: Robust smooth scrolling with better targeting
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        let targetId = this.getAttribute('href');
        
        // Skip empty or just # links
        if (targetId === '#' || targetId === '') return;
        
        // Handle cross-page navigation (like /#about from other pages)
        if (targetId.includes('/#')) {
          targetId = targetId.split('/#')[1];
          targetId = '#' + targetId;
        }
        
        console.log('Looking for target:', targetId);
        
        // Wait a moment for DOM to be ready
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Close mobile menu if open
            if (menuToggle && menuToggle.classList.contains('active')) {
              menuToggle.classList.remove('active');
              navLinks.classList.remove('active');
            }
            
            // Calculate proper header height
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : (window.innerWidth <= 768 ? 80 : 100);
            const extraBuffer = 20; // Extra breathing room
            
            // Calculate target position
            const targetPosition = targetElement.offsetTop - headerHeight - extraBuffer;
            
            // Smooth scroll with fallback
            if ('scrollBehavior' in document.documentElement.style) {
              window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
              });
            } else {
              // Fallback for older browsers
              window.scrollTo(0, Math.max(0, targetPosition));
            }
            
            console.log('Scrolling to:', targetId, 'Header height:', headerHeight, 'Target position:', targetPosition, 'Element offset:', targetElement.offsetTop);
          } else {
            console.warn('Target element not found:', targetId);
            
            // Try alternative selectors
            const alternatives = [
              targetId.replace('#', '[id="') + '"]',
              targetId.replace('#', '[data-section="') + '"]'
            ];
            
            for (let alt of alternatives) {
              const altElement = document.querySelector(alt);
              if (altElement) {
                console.log('Found alternative target:', alt);
                const headerHeight = window.innerWidth <= 768 ? 80 : 100;
                const targetPosition = altElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                  top: Math.max(0, targetPosition),
                  behavior: 'smooth'
                });
                return;
              }
            }
          }
        }, 50); // Small delay to ensure DOM is ready
      });
    });
  }
  
  // Initialize smooth scrolling
  setupSmoothScrolling();
  
  // Re-setup on dynamic content changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        setupSmoothScrolling();
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Debug: Enhanced section checking
  const sections = ['#proof-points', '#contact', '#contact-form', '#about', '#advantage', '#grants-database'];
  
  function checkSections() {
    console.log('=== SECTION DEBUG ===');
    sections.forEach(sectionId => {
      const element = document.querySelector(sectionId);
      if (element) {
        console.log('✓ Found:', sectionId, 'Offset:', element.offsetTop);
      } else {
        console.warn('✗ Missing:', sectionId);
      }
    });
    
    // Check all elements with IDs
    const allIds = document.querySelectorAll('[id]');
    console.log('All elements with IDs:');
    allIds.forEach(el => {
      console.log('  -', '#' + el.id, el.tagName);
    });
    console.log('===================');
  }
  
  // Run debug check
  checkSections();
  
  // Handle page load with hash
  if (window.location.hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        const headerHeight = window.innerWidth <= 768 ? 80 : 100;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    }, 500); // Wait for page to fully load
  }
});