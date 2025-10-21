// Tally Native Exit Intent Implementation
// Alternative to custom exit intent - uses Tally's built-in exit trigger

// Option 1: Simple Tally native exit intent (recommended for quick setup)
window.TallyConfig = {
  "formId": "mKq9p7",
  "popup": {
    "emoji": {
      "text": "👋",
      "animation": "tada"
    },
    "open": {
      "trigger": "exit"
    },
    "hideTitle": false,
    "showOnce": true, // Only show once per session
    "doNotShowAfterSubmit": true // Don't show again after submission
  }
};

// Enhanced tracking for Tally native popup
document.addEventListener('DOMContentLoaded', function() {
  // Track when Tally popup is shown
  if (window.Tally) {
    window.Tally.on('open', function() {
      // Track with Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'tally_popup_shown', {
          event_category: 'Lead Generation',
          event_label: 'Tally Exit Intent',
          value: 50
        });
      }
      
      console.log('Tally exit intent popup opened');
    });
    
    // Track form submission
    window.Tally.on('submit', function(payload) {
      // Track conversion with Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'tally_form_submitted', {
          event_category: 'Lead Generation',
          event_label: 'Exit Intent Conversion',
          value: 250
        });
        
        // Mark as high-value conversion
        gtag('event', 'conversion', {
          send_to: 'G-QJNRR6GPV8/tally_exit_intent',
          value: 250,
          currency: 'USD'
        });
      }
      
      console.log('Tally form submitted:', payload);
    });
    
    // Track popup close without submission
    window.Tally.on('close', function() {
      // Track abandonment
      if (typeof gtag !== 'undefined') {
        gtag('event', 'tally_popup_closed', {
          event_category: 'Lead Generation',
          event_label: 'Exit Intent Abandoned'
        });
      }
    });
  }
});

// Optional: Add custom timing and scroll requirements before enabling Tally
// This gives you more control over when the exit intent can trigger
(function() {
  let qualifiedForExit = false;
  let timeOnPage = 0;
  let scrollDepth = 0;
  
  // Minimum requirements
  const MIN_TIME = 15000; // 15 seconds
  const MIN_SCROLL = 30; // 30% scroll depth
  
  // Track time on page
  setTimeout(() => {
    timeOnPage = MIN_TIME;
    checkQualification();
  }, MIN_TIME);
  
  // Track scroll depth
  window.addEventListener('scroll', () => {
    const percent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    scrollDepth = Math.max(scrollDepth, percent);
    checkQualification();
  });
  
  function checkQualification() {
    if (!qualifiedForExit && timeOnPage >= MIN_TIME && scrollDepth >= MIN_SCROLL) {
      qualifiedForExit = true;
      
      // Now enable Tally exit intent
      if (window.Tally) {
        window.Tally.enableExitIntent();
        console.log('User qualified for exit intent popup');
      }
    }
  }
})();