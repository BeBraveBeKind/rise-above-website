// Lazy Loading Implementation for Rise Above Partners
// Improves page load performance by loading images only when needed

(function() {
  'use strict';
  
  // Check if native lazy loading is supported
  const hasNativeLazyLoad = 'loading' in HTMLImageElement.prototype;
  
  if (hasNativeLazyLoad) {
    // Use native lazy loading
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  } else {
    // Fallback to Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          // Add loaded class for animations
          img.classList.add('lazy-loaded');
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      // Start loading 100px before the image enters viewport
      rootMargin: '100px 0px',
      threshold: 0.01
    });
    
    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Also handle background images
    const bgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const bgImage = element.dataset.bg;
          
          if (bgImage) {
            element.style.backgroundImage = `url(${bgImage})`;
            element.classList.add('bg-loaded');
          }
          
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });
    
    // Observe elements with background images
    const bgElements = document.querySelectorAll('[data-bg]');
    bgElements.forEach(el => bgObserver.observe(el));
  }
  
  // Preload critical images (hero images)
  function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  }
  
  // Run critical image loading immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalImages);
  } else {
    preloadCriticalImages();
  }
})();