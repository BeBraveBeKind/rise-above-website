// Scroll-Triggered Animations for Rise Above Partners
// Enhances user experience with smooth, performant animations

(function() {
  'use strict';
  
  // Animation configuration
  const config = {
    threshold: 0.1,
    rootMargin: '50px',
    staggerDelay: 100
  };
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    console.log('Animations disabled: User prefers reduced motion');
    return;
  }
  
  // Initialize Intersection Observer
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple elements
        const delay = entry.target.dataset.delay || index * config.staggerDelay;
        
        setTimeout(() => {
          entry.target.classList.add('animate-in');
          
          // Track animation engagement
          if (window.gtag) {
            gtag('event', 'animation_triggered', {
              event_category: 'Engagement',
              event_label: entry.target.dataset.animation || 'fade-in',
              value: 1
            });
          }
        }, delay);
        
        // Stop observing after animation
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: config.threshold,
    rootMargin: config.rootMargin
  });
  
  // Add CSS for animations
  function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Base animation classes */
      .animate-fade-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-fade-up.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      .animate-fade-in {
        opacity: 0;
        transition: opacity 0.8s ease;
      }
      
      .animate-fade-in.animate-in {
        opacity: 1;
      }
      
      .animate-slide-left {
        opacity: 0;
        transform: translateX(50px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-slide-left.animate-in {
        opacity: 1;
        transform: translateX(0);
      }
      
      .animate-slide-right {
        opacity: 0;
        transform: translateX(-50px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-slide-right.animate-in {
        opacity: 1;
        transform: translateX(0);
      }
      
      .animate-scale {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-scale.animate-in {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Counter animation */
      .animate-counter {
        display: inline-block;
      }
      
      /* Pulse animation for CTAs */
      @keyframes pulse-soft {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      
      .animate-pulse {
        animation: pulse-soft 2s infinite;
      }
      
      /* Mobile optimizations */
      @media (max-width: 768px) {
        .animate-fade-up {
          transform: translateY(20px);
        }
        
        .animate-slide-left,
        .animate-slide-right {
          transform: translateX(30px);
        }
      }
      
      /* Disable animations for print */
      @media print {
        * {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Apply animations to elements
  function setupAnimations() {
    // Hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('animate-fade-up');
      animationObserver.observe(heroContent);
    }
    
    // Service cards
    const serviceCards = document.querySelectorAll('.advantage-pillar, .service-card');
    serviceCards.forEach((card, index) => {
      card.classList.add('animate-fade-up');
      card.dataset.delay = index * 100;
      animationObserver.observe(card);
    });
    
    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      header.classList.add('animate-fade-in');
      animationObserver.observe(header);
    });
    
    // FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
      item.classList.add('animate-fade-up');
      item.dataset.delay = index * 50;
      animationObserver.observe(item);
    });
    
    // CTA buttons (add subtle pulse)
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
      if (btn.textContent.includes('Book') || btn.textContent.includes('Get')) {
        btn.classList.add('animate-pulse');
      }
    });
    
    // Testimonials
    const testimonials = document.querySelectorAll('.testimonial-item');
    testimonials.forEach((item, index) => {
      item.classList.add('animate-scale');
      item.dataset.delay = index * 100;
      animationObserver.observe(item);
    });
  }
  
  // Animate numbers/counters
  function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.counter);
          const duration = parseInt(counter.dataset.duration) || 2000;
          const start = 0;
          const increment = target / (duration / 16);
          
          let current = start;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current).toLocaleString();
            }
          }, 16);
          
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
  
  // Parallax effect for hero images (subtle)
  function setupParallax() {
    const heroImage = document.querySelector('.hero-background img');
    if (!heroImage) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const speed = 0.5;
      
      heroImage.style.transform = `translateY(${scrolled * speed}px)`;
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
  
  // Initialize all animations
  function init() {
    injectAnimationStyles();
    setupAnimations();
    animateCounters();
    
    // Only enable parallax on desktop
    if (window.innerWidth > 768) {
      setupParallax();
    }
    
    console.log('Rise Above animations initialized');
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();