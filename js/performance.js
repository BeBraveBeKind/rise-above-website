// Performance Monitoring for Rise Above Partners
// Tracks Core Web Vitals and sends to GA-4

(function() {
  'use strict';
  
  // Check if Performance API is available
  if (!window.performance || !window.performance.getEntriesByType) return;
  
  // Track Core Web Vitals
  function trackWebVitals() {
    // First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    if (fcp && window.gtag) {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'FCP',
        value: Math.round(fcp.startTime),
        metric_name: 'first_contentful_paint',
        metric_value: Math.round(fcp.startTime)
      });
    }
    
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (window.gtag) {
            gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'LCP',
              value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
              metric_name: 'largest_contentful_paint',
              metric_value: Math.round(lastEntry.renderTime || lastEntry.loadTime)
            });
          }
          
          lcpObserver.disconnect();
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // LCP not supported
      }
      
      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstInput = entries[0];
          
          if (firstInput && window.gtag) {
            const fid = firstInput.processingStart - firstInput.startTime;
            
            gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round(fid),
              metric_name: 'first_input_delay',
              metric_value: Math.round(fid)
            });
          }
          
          fidObserver.disconnect();
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // FID not supported
      }
      
      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        let clsEntries = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              clsEntries.push(entry);
            }
          }
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Report CLS when page is about to unload
        window.addEventListener('beforeunload', () => {
          if (window.gtag && clsValue > 0) {
            gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000),
              metric_name: 'cumulative_layout_shift',
              metric_value: clsValue
            });
          }
        });
      } catch (e) {
        // CLS not supported
      }
    }
  }
  
  // Track page load performance
  function trackPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        if (window.gtag) {
          // Total page load time
          gtag('event', 'page_load_time', {
            event_category: 'Performance',
            event_label: window.location.pathname,
            value: pageLoadTime,
            page_location: window.location.pathname
          });
          
          // Server response time
          gtag('event', 'server_response_time', {
            event_category: 'Performance',
            event_label: window.location.pathname,
            value: connectTime
          });
          
          // DOM render time
          gtag('event', 'dom_render_time', {
            event_category: 'Performance',
            event_label: window.location.pathname,
            value: renderTime
          });
        }
        
        // Log to console for debugging
        console.log('Performance Metrics:', {
          pageLoadTime: pageLoadTime + 'ms',
          serverResponseTime: connectTime + 'ms',
          domRenderTime: renderTime + 'ms'
        });
      }, 0);
    });
  }
  
  // Track resource loading performance
  function trackResources() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      
      // Group resources by type
      const resourceTypes = {};
      
      resources.forEach(resource => {
        const type = resource.initiatorType;
        if (!resourceTypes[type]) {
          resourceTypes[type] = {
            count: 0,
            totalDuration: 0,
            totalSize: 0
          };
        }
        
        resourceTypes[type].count++;
        resourceTypes[type].totalDuration += resource.duration;
        
        // Track slow resources (> 1 second)
        if (resource.duration > 1000 && window.gtag) {
          gtag('event', 'slow_resource', {
            event_category: 'Performance',
            event_label: resource.name,
            value: Math.round(resource.duration),
            resource_type: type
          });
        }
      });
      
      // Log resource summary
      console.log('Resource Performance:', resourceTypes);
    });
  }
  
  // Initialize all tracking
  function init() {
    trackWebVitals();
    trackPageLoad();
    trackResources();
    
    // Track if user has slow connection
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        if (window.gtag) {
          gtag('event', 'slow_connection', {
            event_category: 'Performance',
            event_label: connection.effectiveType,
            value: 1
          });
        }
      }
    }
  }
  
  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();