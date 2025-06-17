// FIXED: Enhanced JavaScript with proper desktop header calculation
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

  // FIXED: Smooth scrolling with correct header heights
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (menuToggle && menuToggle.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
        
        // FIXED: Use correct header heights
        const headerHeight = window.innerWidth <= 768 ? 80 : 100; // Desktop = 100px, Mobile = 80px
        const targetPosition = targetElement.offsetTop - headerHeight - 20; // Add 20px buffer
        
        // Smooth scroll
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
        
        console.log('Scrolling to:', targetId, 'Header height:', headerHeight, 'Target position:', targetPosition);
      } else {
        console.warn('Target not found:', targetId);
      }
    });
  });
  
  // Debug: Check if target sections exist and log their positions
  const sections = ['#proof-points', '#contact', '#about', '#advantage'];
  sections.forEach(sectionId => {
    const element = document.querySelector(sectionId);
    if (element) {
      console.log('Section found:', sectionId, 'Offset:', element.offsetTop);
    } else {
      console.warn('Section missing:', sectionId);
    }
  });
  
  // ADDITIONAL: Add active state handling for better UX
  window.addEventListener('scroll', function() {
    const scrollPos = window.scrollY + (window.innerWidth <= 768 ? 80 : 100) + 50;
    
    sections.forEach(sectionId => {
      const element = document.querySelector(sectionId);
      const navLink = document.querySelector(`a[href="${sectionId}"]`);
      
      if (element && navLink) {
        const sectionTop = element.offsetTop;
        const sectionBottom = sectionTop + element.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          // Remove active from all nav links
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
          });
          // Add active to current section link
          navLink.classList.add('active');
        }
      }
    });
  });
});