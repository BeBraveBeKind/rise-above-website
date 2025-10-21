// Exit Intent Popup for Rise Above Partners
// Lead capture with intelligent triggering and Tally form integration

class ExitIntentPopup {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      // Timing settings
      minTimeOnPage: config.minTimeOnPage || 15000, // 15 seconds minimum
      minScrollDepth: config.minScrollDepth || 35, // 35% scroll minimum
      cookieDays: config.cookieDays || 14, // Don't show again for 14 days
      mobileScrollTrigger: config.mobileScrollTrigger || 70, // 70% scroll on mobile
      
      // Tally form settings
      tallyFormId: config.tallyFormId || 'mKq9p7', // Your Tally form ID
      
      // Feature flags
      enabled: config.enabled !== false,
      debugMode: config.debugMode || false
    };
    
    // State tracking
    this.state = {
      hasShown: false,
      timeOnPage: 0,
      scrollDepth: 0,
      qualifiedToShow: false,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    
    // Check if already shown (cookie check)
    if (this.getCookie('exitIntentShown')) {
      this.state.hasShown = true;
      if (this.config.debugMode) console.log('Exit intent suppressed by cookie');
      return;
    }
    
    // Initialize if enabled
    if (this.config.enabled) {
      this.init();
    }
  }
  
  init() {
    // Create popup HTML structure
    this.createPopup();
    
    // Start tracking time on page
    this.startTimeTracking();
    
    // Set up scroll tracking
    this.setupScrollTracking();
    
    // Set up exit intent detection
    if (!this.state.isMobile) {
      this.setupExitIntent();
    }
    
    // Set up close handlers
    this.setupCloseHandlers();
    
    if (this.config.debugMode) {
      console.log('Exit intent popup initialized', this.config);
    }
  }
  
  createPopup() {
    // Create popup container
    const popupHTML = `
      <div id="exit-intent-overlay" class="exit-popup-overlay" style="display: none;">
        <div class="exit-popup-container">
          <button class="exit-popup-close" aria-label="Close popup">&times;</button>
          
          <div class="exit-popup-content">
            <h2 class="exit-popup-headline">Before You Go—See How AI Agents Could 10X Your Marketing</h2>
            <p class="exit-popup-subhead">Get your free AI readiness assessment and discover exactly how much time and money you could save with custom AI agents.</p>
            
            <div class="exit-popup-benefits">
              <div class="benefit-item">
                <span class="benefit-icon">⚡</span>
                <span>5-minute assessment</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <span>Custom ROI calculation</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🚀</span>
                <span>Actionable recommendations</span>
              </div>
            </div>
            
            <!-- Tally form embed container -->
            <div id="tally-form-container" class="exit-popup-form">
              <!-- Tally form will be embedded here -->
            </div>
            
            <p class="exit-popup-disclaimer">No spam, ever. Limited spots available for Q4 2025.</p>
          </div>
        </div>
      </div>
    `;
    
    // Add CSS styles
    const styles = `
      <style>
        .exit-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-in;
        }
        
        .exit-popup-container {
          background: white;
          border-radius: 12px;
          max-width: 540px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease-out;
        }
        
        .exit-popup-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 32px;
          color: #666;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        
        .exit-popup-close:hover {
          color: #000;
        }
        
        .exit-popup-content {
          padding: 40px 30px;
          text-align: center;
        }
        
        .exit-popup-headline {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 15px 0;
          color: #1a1a1a;
          line-height: 1.3;
        }
        
        .exit-popup-subhead {
          font-size: 16px;
          color: #666;
          margin: 0 0 25px 0;
          line-height: 1.5;
        }
        
        .exit-popup-benefits {
          display: flex;
          justify-content: space-around;
          margin: 0 0 30px 0;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #333;
        }
        
        .benefit-icon {
          font-size: 18px;
        }
        
        .exit-popup-form {
          margin: 0 0 20px 0;
          min-height: 200px;
        }
        
        .exit-popup-disclaimer {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(30px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 600px) {
          .exit-popup-container {
            width: 95%;
            margin: 20px;
          }
          
          .exit-popup-content {
            padding: 30px 20px;
          }
          
          .exit-popup-headline {
            font-size: 22px;
          }
          
          .exit-popup-benefits {
            flex-direction: column;
            align-items: center;
          }
        }
      </style>
    `;
    
    // Inject styles and HTML
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Store references
    this.overlay = document.getElementById('exit-intent-overlay');
    this.container = document.querySelector('.exit-popup-container');
    this.formContainer = document.getElementById('tally-form-container');
  }
  
  startTimeTracking() {
    // Track time on page
    setTimeout(() => {
      this.state.timeOnPage = this.config.minTimeOnPage;
      this.checkQualification();
    }, this.config.minTimeOnPage);
  }
  
  setupScrollTracking() {
    let ticking = false;
    
    const updateScrollDepth = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      this.state.scrollDepth = Math.max(this.state.scrollDepth, scrollPercent);
      
      // Check qualification
      this.checkQualification();
      
      // Mobile trigger check
      if (this.state.isMobile && scrollPercent >= this.config.mobileScrollTrigger) {
        this.triggerPopup('mobile_scroll');
      }
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    });
  }
  
  setupExitIntent() {
    // Track mouse movement for exit intent
    document.addEventListener('mouseleave', (e) => {
      // Check if mouse is leaving from the top
      if (e.clientY <= 0 && this.state.qualifiedToShow) {
        this.triggerPopup('exit_intent');
      }
    });
    
    // Alternative: Track mouse movement patterns
    let mouseY = 0;
    let oldMouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      oldMouseY = mouseY;
      mouseY = e.clientY;
      
      // Detect rapid upward movement toward browser chrome
      if (oldMouseY > mouseY && mouseY < 100 && this.state.qualifiedToShow) {
        const velocity = oldMouseY - mouseY;
        if (velocity > 15) {
          this.triggerPopup('exit_velocity');
        }
      }
    });
  }
  
  checkQualification() {
    // Check if user qualifies to see popup
    if (this.state.timeOnPage >= this.config.minTimeOnPage && 
        this.state.scrollDepth >= this.config.minScrollDepth) {
      this.state.qualifiedToShow = true;
      
      if (this.config.debugMode) {
        console.log('User qualified for exit intent popup');
      }
    }
  }
  
  triggerPopup(trigger_type = 'manual') {
    // Don't show if already shown or not qualified
    if (this.state.hasShown || (!this.state.qualifiedToShow && !this.config.debugMode)) {
      return;
    }
    
    // Mark as shown
    this.state.hasShown = true;
    
    // Show the popup
    this.showPopup();
    
    // Track analytics event
    this.trackEvent('popup_triggered', {
      trigger_type: trigger_type,
      time_on_page: Math.round(Date.now() / 1000),
      scroll_depth: Math.round(this.state.scrollDepth)
    });
    
    // Set cookie to prevent reshowing
    this.setCookie('exitIntentShown', '1', this.config.cookieDays);
  }
  
  showPopup() {
    // Embed Tally form
    this.embedTallyForm();
    
    // Show overlay
    this.overlay.style.display = 'flex';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Track view event
    this.trackEvent('popup_viewed');
  }
  
  hidePopup() {
    // Hide overlay
    this.overlay.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Track close event
    this.trackEvent('popup_closed');
  }
  
  
  embedTallyForm() {
    // Use the exact embed format from Tally
    this.formContainer.innerHTML = `
      <iframe 
        data-tally-src="https://tally.so/embed/mKq9p7?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
        loading="lazy" 
        width="100%" 
        height="250" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0" 
        title="BEFORE YOU GO">
      </iframe>
    `;
    
    // Load Tally script and initialize
    if (!document.querySelector('script[src*="tally.so/widgets/embed.js"]')) {
      var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}
    } else {
      // Script exists, just initialize
      if(typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
      } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function(e) {
          e.src = e.dataset.tallySrc;
        });
      }
    }
    
    // Listen for Tally form submission
    window.addEventListener('message', (e) => {
      if (e.data && e.data.event === 'Tally.FormSubmitted') {
        this.onFormSubmit();
      }
    });
  }
  
  onFormSubmit() {
    // Track conversion
    this.trackEvent('form_submitted', {
      form_type: 'exit_intent_tally',
      value: 250
    });
    
    // Show success message
    this.formContainer.innerHTML = `
      <div class="exit-popup-success">
        <h3>🎉 Perfect! Check your email.</h3>
        <p>Your AI readiness assessment will arrive in 2-3 minutes.</p>
        <button class="btn btn-primary" onclick="exitIntentPopup.hidePopup()">Got it</button>
      </div>
    `;
    
    // Auto-close after 5 seconds
    setTimeout(() => this.hidePopup(), 5000);
  }
  
  setupCloseHandlers() {
    // Close button
    document.querySelector('.exit-popup-close').addEventListener('click', () => {
      this.hidePopup();
    });
    
    // Overlay click (outside popup)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hidePopup();
      }
    });
    
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.style.display !== 'none') {
        this.hidePopup();
      }
    });
  }
  
  trackEvent(eventName, parameters = {}) {
    // Track with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', `exit_intent_${eventName}`, {
        event_category: 'Lead Generation',
        event_label: 'Exit Intent Popup',
        ...parameters
      });
    }
    
    // Track with custom analytics if available
    if (window.analyticsTracker) {
      window.analyticsTracker.trackCustomEvent(`exit_intent_${eventName}`, parameters);
    }
    
    if (this.config.debugMode) {
      console.log('Exit intent event:', eventName, parameters);
    }
  }
  
  // Cookie utilities
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
  
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  // Public methods for manual control
  show() {
    this.triggerPopup('manual');
  }
  
  hide() {
    this.hidePopup();
  }
  
  reset() {
    // Clear cookie and reset state
    this.setCookie('exitIntentShown', '', -1);
    this.state.hasShown = false;
    this.state.qualifiedToShow = false;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize with your configuration
    window.exitIntentPopup = new ExitIntentPopup({
      minTimeOnPage: 20000, // 20 seconds
      minScrollDepth: 35, // 35% scroll
      cookieDays: 14, // Don't show again for 2 weeks
      mobileScrollTrigger: 70, // 70% scroll on mobile
      tallyFormId: 'mKq9p7', // Your Tally form ID
      enabled: true,
      debugMode: false // Set to true for testing
    });
  });
} else {
  window.exitIntentPopup = new ExitIntentPopup({
    minTimeOnPage: 20000,
    minScrollDepth: 35,
    cookieDays: 14,
    mobileScrollTrigger: 70,
    tallyFormId: 'mKq9p7', // Your Tally form ID
    enabled: true,
    debugMode: false
  });
}