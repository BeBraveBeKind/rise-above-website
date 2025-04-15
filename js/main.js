// Use strict mode for better error catching and performance
'use strict';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Dynamic content loading from CMS
  loadDynamicContent();

  // Initialize lazy loading for images
  initLazyLoading();

  // Initialize mobile navigation
  initMobileNav();

  // Initialize Tally form embed
  initTallyForm();
});

// Function to load dynamic content from CMS
function loadDynamicContent() {
  // Load home page content
  fetch('/_data/home.json')
    .then(response => response.json())
    .then(data => {
      // Populate content from CMS data
      document.querySelectorAll('[data-content]').forEach(element => {
        const field = element.getAttribute('data-content');
        if (data[field]) {
          element.textContent = data[field];
        }
      });
      
      // Handle features section if it exists
      if (data.features && Array.isArray(data.features)) {
        const featuresContainer = document.getElementById('features-container');
        if (featuresContainer) {
          // Clear existing content
          featuresContainer.innerHTML = '';
          
          // Add each feature
          data.features.forEach(feature => {
            const featureElement = createFeatureElement(feature);
            featuresContainer.appendChild(featureElement);
          });
        }
      }
    })
    .catch(error => {
      console.error('Error loading home content:', error);
    });

  // Load services
  loadServices();
  
  // Load testimonials
  loadTestimonials();
}

// Load services from CMS
function loadServices() {
  // In a production environment, this would fetch data from CMS
  // For now, using placeholder services that match the CMS structure
  const services = [
    {
      title: "Digital Strategy",
      description: "Comprehensive digital marketing strategies tailored to your niche industry and target audience.",
      image: "https://via.placeholder.com/400x200",
      order: 1
    },
    {
      title: "Content Creation",
      description: "Compelling content that resonates with your audience and establishes your authority in your industry.",
      image: "https://via.placeholder.com/400x200", 
      order: 2
    },
    {
      title: "Web Presence",
      description: "Professional website development and optimization that showcases your expertise and converts visitors.",
      image: "https://via.placeholder.com/400x200",
      order: 3
    }
  ];
  
  const servicesContainer = document.getElementById('services-container');
  if (servicesContainer) {
    // Clear existing content
    servicesContainer.innerHTML = '';
    
    // Sort services by order
    services.sort((a, b) => a.order - b.order);
    
    // Add each service
    services.forEach(service => {
      const serviceElement = createServiceElement(service);
      servicesContainer.appendChild(serviceElement);
    });
  }
}

// Load testimonials from CMS
function loadTestimonials() {
  // In a production environment, this would fetch data from CMS
  // For now, using placeholder testimonials that match the CMS structure
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechSolutions Inc.",
      testimonial: "Rise Above Partners transformed our digital marketing strategy. Their deep understanding of our niche industry and tailored approach led to a 43% increase in qualified leads within just three months.",
      avatar: "https://via.placeholder.com/60x60"
    },
    {
      name: "Michael Chen",
      company: "Precision Engineering",
      testimonial: "Working with Rise Above Partners has been a game-changer for our firm. Their content strategy has positioned us as thought leaders in our field, significantly expanding our client base and industry recognition.",
      avatar: "https://via.placeholder.com/60x60"
    }
  ];
  
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (testimonialsContainer) {
    // Clear existing content
    testimonialsContainer.innerHTML = '';
    
    // Add each testimonial
    testimonials.forEach(testimonial => {
      const testimonialElement = createTestimonialElement(testimonial);
      testimonialsContainer.appendChild(testimonialElement);
    });
  }
}

// Create feature element from data
function createFeatureElement(feature) {
  const featureCard = document.createElement('div');
  featureCard.className = 'feature-card';
  
  // Create icon
  const iconDiv = document.createElement('div');
  iconDiv.className = 'feature-icon';
  
  // Use correct icon based on feature type
  let iconSvg = '';
  switch(feature.icon) {
    case 'strategic':
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>';
      break;
    case 'creative':
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>';
      break;
    case 'data':
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>';
      break;
    default:
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
  }
  
  iconDiv.innerHTML = iconSvg;
  featureCard.appendChild(iconDiv);
  
  // Create title
  const title = document.createElement('h3');
  title.textContent = feature.title;
  featureCard.appendChild(title);
  
  // Create description
  const description = document.createElement('p');
  description.textContent = feature.description;
  featureCard.appendChild(description);
  
  return featureCard;
}

// Create service element from data
function createServiceElement(service) {
  const serviceCard = document.createElement('div');
  serviceCard.className = 'service-card';
  
  // Create image container
  const imageDiv = document.createElement('div');
  imageDiv.className = 'service-image';
  
  // Create image
  const img = document.createElement('img');
  img.className = 'lazy';
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent placeholder
  img.dataset.src = service.image;
  img.alt = service.title;
  
  imageDiv.appendChild(img);
  serviceCard.appendChild(imageDiv);
  
  // Create content container
  const contentDiv = document.createElement('div');
  contentDiv.className = 'service-content';
  
  // Create title
  const title = document.createElement('h3');
  title.textContent = service.title;
  contentDiv.appendChild(title);
  
  // Create description
  const description = document.createElement('p');
  description.textContent = service.description;
  contentDiv.appendChild(description);
  
  // Create link
  const link = document.createElement('a');
  link.href = '#contact';
  link.textContent = 'Learn More';
  contentDiv.appendChild(link);
  
  serviceCard.appendChild(contentDiv);
  
  return serviceCard;
}

// Create testimonial element from data
function createTestimonialElement(testimonial) {
  const testimonialCard = document.createElement('div');
  testimonialCard.className = 'testimonial-card';
  
  // Create testimonial text
  const text = document.createElement('p');
  text.className = 'testimonial-text';
  text.textContent = testimonial.testimonial;
  testimonialCard.appendChild(text);
  
  // Create author container
  const authorDiv = document.createElement('div');
  authorDiv.className = 'testimonial-author';
  
  // Create avatar
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'testimonial-avatar';
  
  const avatarImg = document.createElement('img');
  avatarImg.src = testimonial.avatar;
  avatarImg.alt = testimonial.name;
  
  avatarDiv.appendChild(avatarImg);
  authorDiv.appendChild(avatarDiv);
  
  // Create author info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'testimonial-info';
  
  const authorName = document.createElement('h4');
  authorName.textContent = testimonial.name;
  infoDiv.appendChild(authorName);
  
  const authorCompany = document.createElement('p');
  authorCompany.textContent = testimonial.company;
  infoDiv.appendChild(authorCompany);
  
  authorDiv.appendChild(infoDiv);
  testimonialCard.appendChild(authorDiv);
  
  return testimonialCard;
}

// Initialize lazy loading for images
function initLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Load all images immediately
    document.querySelectorAll('img.lazy').forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// Mobile navigation toggle
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

// Initialize Tally form embed
function initTallyForm() {
  const tallyEmbed = document.getElementById('tally-embed');
  if (tallyEmbed) {
    // Placeholder for Tally form - you'll add the actual embed code later
    tallyEmbed.innerHTML = `
      <form>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="company">Company</label>
          <input type="text" id="company" class="form-control">
        </div>
        <div class="form-group">
          <label for="message">How Can We Help?</label>
          <textarea id="message" class="form-control" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
      </form>
    `;
  }
}