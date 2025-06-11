document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
  
  // Function to fetch and parse JSON data
  async function fetchJSONData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  // Load home page data
  async function loadHomeData() {
    const homeData = await fetchJSONData('/_data/home.json');
    if (homeData) {
      // Update hero section
      const heroTitle = document.querySelector('[data-content="heroTitle"]');
      const heroDescription = document.querySelector('[data-content="heroDescription"]');
      
      if (heroTitle) heroTitle.textContent = homeData.heroTitle;
      if (heroDescription) heroDescription.textContent = homeData.heroDescription;
      
      // Update features
      const featuresContainer = document.getElementById('features-container');
      if (featuresContainer && homeData.features) {
        featuresContainer.innerHTML = '';
        
        homeData.features.forEach(feature => {
          const card = document.createElement('div');
          card.className = 'feature-card';
          
          let iconSvg = '';
          switch(feature.icon) {
            case 'strategic':
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
              break;
            case 'creative':
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>';
              break;
            case 'data':
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
              break;
          }
          
          card.innerHTML = `
            <div class="feature-icon">
              ${iconSvg}
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
          `;
          
          featuresContainer.appendChild(card);
        });
      }
    }
  }

  // Call loadHomeData
  loadHomeData();

  // Smooth scrolling for anchor links
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
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Feature cards fallback - only if features-container exists but is empty
  const featuresContainer = document.getElementById('features-container');
  if (featuresContainer && featuresContainer.children.length === 0) {
    const features = [
      {
        title: "Strategic Insight",
        description: "We dig deep to understand your market, audience, and competition to develop strategies that set you apart.",
        icon: "strategic"
      },
      {
        title: "Creative Excellence",
        description: "Our team crafts compelling content and designs that capture attention and communicate your value proposition.",
        icon: "creative"
      },
      {
        title: "Data-Driven Decisions",
        description: "We analyze performance metrics to continuously refine our approach and maximize your return on investment.",
        icon: "data"
      }
    ];
    
    features.forEach(feature => {
      const card = document.createElement('div');
      card.className = 'feature-card';
      
      let iconSvg = '';
      switch(feature.icon) {
        case 'strategic':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
          break;
        case 'creative':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>';
          break;
        case 'data':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
          break;
      }
      
      card.innerHTML = `
        <div class="feature-icon">
          ${iconSvg}
        </div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
      `;
      
      featuresContainer.appendChild(card);
    });
  }
  
  // Initialize Tally form embed
  function loadTallyForm() {
    const tallyEmbed = document.getElementById('tally-embed');
    if (!tallyEmbed) return;
    
    // Check if iframe already exists
    if (tallyEmbed.querySelector('iframe')) return;
    
    // Create iframe element if it doesn't exist
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://tally.so/embed/w4KVxg?alignLeft=1&hideTitle=1&transparentBackground=1');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('marginheight', '0');
    iframe.setAttribute('marginwidth', '0');
    iframe.setAttribute('title', 'Contact Form');
    iframe.style.border = 'none';
    
    // Append iframe to container
    tallyEmbed.appendChild(iframe);
    
    // Load Tally script if not already loaded
    if (!window.Tally) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }
  
  // Load the form when page loads
  loadTallyForm();
  
  // Load the form when navigating to the contact section
  const contactLinks = document.querySelectorAll('a[href="#contact"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Small delay to ensure section is visible
      setTimeout(loadTallyForm, 200);
    });
  });
  
  // Lazy loading implementation
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0) {
    // Create intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Only load images when they come into viewport
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          
          // Optionally remove data-src after loading
          img.removeAttribute('data-src');
          
          // Stop observing image
          observer.unobserve(img);
        }
      });
    });
    
    // Observe each image
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Lazy loading for images with .lazy class
  const lazyImagesClass = document.querySelectorAll('img.lazy');
  if ('IntersectionObserver' in window && lazyImagesClass.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add('loaded');
          imageObserver.unobserve(image);
        }
      });
    });
    
    lazyImagesClass.forEach(image => {
      imageObserver.observe(image);
    });
  } else if (lazyImagesClass.length > 0) {
    // Fallback for browsers without IntersectionObserver
    lazyImagesClass.forEach(image => {
      image.src = image.dataset.src;
      image.classList.add('loaded');
    });
  }
});