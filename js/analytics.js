// Analytics Event Tracking for Rise Above Partners
// GA-4 ID: G-QJNRR6GPV8

class AnalyticsTracker {
  constructor() {
    this.isInitialized = typeof gtag !== 'undefined';
    this.scrollPoints = {25: false, 50: false, 75: false, 90: false};
    this.formStartTracked = {};
    
    if (this.isInitialized) {
      this.initializeTracking();
    } else {
      console.log('GA-4 not initialized. Analytics tracking disabled.');
    }
  }

  // Initialize all tracking events
  initializeTracking() {
    this.trackScrollDepth();
    this.trackTimeOnPage();
    this.trackFormEngagement();
    this.trackCTAClicks();
    this.trackExternalLinks();
    this.trackCalendarBookings();
    this.trackEmailClicks();
    this.trackGrantLinks();
    this.trackServiceInteractions();
    
    // Log initialization
    console.log('Rise Above Analytics Initialized');
  }

  // Track scroll depth
  trackScrollDepth() {
    let lastScrollTime = 0;
    
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime < 1000) return; // Throttle to once per second
      lastScrollTime = now;
      
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      Object.keys(this.scrollPoints).forEach(point => {
        if (scrollPercent >= point && !this.scrollPoints[point]) {
          this.scrollPoints[point] = true;
          gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `${point}%`,
            value: point,
            page_location: window.location.pathname
          });
          
          // Fire page_read event at 75% scroll + 30 seconds
          if (point === 75 && this.timeOnPage >= 30) {
            gtag('event', 'page_read', {
              event_category: 'Engagement',
              event_label: window.location.pathname,
              value: 1
            });
          }
        }
      });
    });
  }

  // Track time on page
  trackTimeOnPage() {
    this.timeOnPage = 0;
    const timePoints = [15, 30, 60, 120];
    
    timePoints.forEach(seconds => {
      setTimeout(() => {
        this.timeOnPage = seconds;
        gtag('event', 'time_on_page', {
          event_category: 'Engagement',
          event_label: `${seconds} seconds`,
          value: seconds,
          page_location: window.location.pathname
        });
        
        // Fire page_read event if user has scrolled 75% and spent 30+ seconds
        if (seconds === 30 && this.scrollPoints[75]) {
          gtag('event', 'page_read', {
            event_category: 'Engagement',
            event_label: window.location.pathname,
            value: 1
          });
        }
      }, seconds * 1000);
    });
  }

  // Track form engagement
  trackFormEngagement() {
    // Track form field focus (first interaction)
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('input, textarea, select')) {
        const form = e.target.closest('form');
        const formName = form?.getAttribute('data-form-name') || 
                        form?.getAttribute('id') || 
                        'contact-form';
        
        if (!this.formStartTracked[formName]) {
          this.formStartTracked[formName] = true;
          gtag('event', 'form_start', {
            event_category: 'Lead Generation',
            event_label: formName,
            form_name: formName,
            page_location: window.location.pathname
          });
        }
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const formName = e.target.getAttribute('data-form-name') || 
                      e.target.getAttribute('id') || 
                      'contact-form';
      
      gtag('event', 'form_submit', {
        event_category: 'Lead Generation',
        event_label: formName,
        form_name: formName,
        value: 100,
        page_location: window.location.pathname
      });
      
      // Mark as conversion
      gtag('event', 'conversion', {
        send_to: 'G-QJNRR6GPV8/form_submit',
        value: 100,
        currency: 'USD'
      });
    });

    // Track Tally form interactions
    this.trackTallyForms();
  }

  // Track Tally form embeds
  trackTallyForms() {
    // Listen for Tally form events if Tally is loaded
    if (window.Tally) {
      window.Tally.on('submit', (payload) => {
        gtag('event', 'tally_form_submit', {
          event_category: 'Lead Generation',
          event_label: 'Tally Form',
          form_id: payload.formId,
          value: 150,
          page_location: window.location.pathname
        });
        
        // Mark as high-value conversion
        gtag('event', 'conversion', {
          send_to: 'G-QJNRR6GPV8/tally_submit',
          value: 150,
          currency: 'USD'
        });
      });
    }
  }

  // Track CTA button clicks
  trackCTAClicks() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn, .cta-button, [data-track="cta"]');
      if (button) {
        const label = button.textContent.trim() || 'Unknown CTA';
        const destination = button.href || 'No destination';
        const buttonClass = button.className || 'no-class';
        
        // Determine CTA value based on button type
        let ctaValue = 10;
        if (buttonClass.includes('primary')) ctaValue = 30;
        if (label.toLowerCase().includes('book') || 
            label.toLowerCase().includes('schedule')) ctaValue = 50;
        if (label.toLowerCase().includes('get in touch') || 
            label.toLowerCase().includes('contact')) ctaValue = 40;
        
        gtag('event', 'cta_click', {
          event_category: 'Engagement',
          event_label: label,
          destination: destination,
          button_class: buttonClass,
          value: ctaValue,
          page_location: window.location.pathname
        });
      }
    });
  }

  // Track calendar booking clicks
  trackCalendarBookings() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && (link.href.includes('calendar.app.google') || 
                   link.href.includes('calendly'))) {
        gtag('event', 'calendar_booking_click', {
          event_category: 'Lead Generation',
          event_label: 'Discovery Call Booking',
          calendar_type: link.href.includes('google') ? 'Google Calendar' : 'Calendly',
          value: 200,
          page_location: window.location.pathname
        });
        
        // Mark as high-value conversion
        gtag('event', 'conversion', {
          send_to: 'G-QJNRR6GPV8/calendar_booking',
          value: 200,
          currency: 'USD'
        });
      }
    });
  }

  // Track external links
  trackExternalLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.hostname && link.hostname !== window.location.hostname) {
        // Skip tracking for calendar and email links (tracked separately)
        if (link.href.includes('calendar') || link.href.startsWith('mailto:')) return;
        
        gtag('event', 'external_link_click', {
          event_category: 'Outbound',
          event_label: link.href,
          destination: link.hostname,
          page_location: window.location.pathname
        });
      }
    });
  }

  // Track email clicks
  trackEmailClicks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="mailto:"]');
      if (link) {
        const email = link.href.replace('mailto:', '');
        gtag('event', 'email_click', {
          event_category: 'Lead Generation',
          event_label: email,
          value: 75,
          page_location: window.location.pathname
        });
        
        // Mark as conversion
        gtag('event', 'conversion', {
          send_to: 'G-QJNRR6GPV8/email_click',
          value: 75,
          currency: 'USD'
        });
      }
    });
  }

  // Track grant link clicks (high intent)
  trackGrantLinks() {
    // Only track on grants page
    if (window.location.pathname.includes('grants')) {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('.grant-item a, .grant-card a');
        if (link) {
          const grantTitle = link.closest('.grant-item, .grant-card')
                              ?.querySelector('h3, h4')?.textContent || 'Unknown Grant';
          
          gtag('event', 'grant_link_click', {
            event_category: 'Engagement',
            event_label: grantTitle,
            grant_url: link.href,
            value: 25,
            page_location: window.location.pathname
          });
        }
      });
    }
  }

  // Track service card interactions
  trackServiceInteractions() {
    // Track service accordion clicks
    document.addEventListener('click', (e) => {
      const serviceHeader = e.target.closest('.service-header-accordion, .service-header');
      if (serviceHeader) {
        const serviceName = serviceHeader.querySelector('h3')?.textContent || 'Unknown Service';
        
        gtag('event', 'service_card_click', {
          event_category: 'Engagement',
          event_label: serviceName,
          value: 15,
          page_location: window.location.pathname
        });
      }
    });

    // Track service CTA clicks
    document.addEventListener('click', (e) => {
      const serviceBtn = e.target.closest('.service-cta-group .btn');
      if (serviceBtn) {
        const serviceName = serviceBtn.closest('.service-accordion-item, .service-card')
                                     ?.querySelector('h3')?.textContent || 'Unknown Service';
        const buttonText = serviceBtn.textContent.trim();
        
        gtag('event', 'service_cta_click', {
          event_category: 'Lead Generation',
          event_label: `${serviceName} - ${buttonText}`,
          service_name: serviceName,
          cta_text: buttonText,
          value: 50,
          page_location: window.location.pathname
        });
      }
    });
  }

  // Custom event helper for manual tracking
  trackCustomEvent(eventName, parameters) {
    if (this.isInitialized) {
      gtag('event', eventName, {
        ...parameters,
        page_location: window.location.pathname
      });
    }
  }

  // Track resource downloads
  trackResourceDownload(resourceName, resourceType) {
    this.trackCustomEvent('resource_download', {
      event_category: 'Engagement',
      event_label: resourceName,
      resource_type: resourceType,
      value: 30
    });
  }
}

// Initialize tracker when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.analyticsTracker = new AnalyticsTracker();
  });
} else {
  window.analyticsTracker = new AnalyticsTracker();
}