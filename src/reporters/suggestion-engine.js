class SuggestionEngine {
  static generate(report) {
    const suggestions = [];
    const categories = report.categories || {};
    const webVitals = categories.webVitals ? categories.webVitals.metrics : {};
    const mainThread = categories.mainThread ? categories.mainThread.metrics : {};

    const lcp = webVitals.lcp && webVitals.lcp.value;
    if (lcp !== null && lcp !== undefined && lcp > 2500) {
      suggestions.push({
        severity: lcp >= 4000 ? 'high' : 'medium',
        category: 'Web Vitals',
        title: 'Optimize Largest Contentful Paint',
        message: 'Optimize largest contentful paint to improve perceived load speed.',
        details: [
          'Preload the LCP image resource with <link rel="preload">',
          'Optimize and compress images (use WebP/AVIF formats)',
          'Reduce render-blocking resources',
          'Use a fast CDN for static assets'
        ]
      });
    }

    const fid = webVitals.fid && webVitals.fid.value;
    if (fid !== null && fid !== undefined && fid > 100) {
      suggestions.push({
        severity: fid >= 300 ? 'high' : 'medium',
        category: 'Web Vitals',
        title: 'Reduce First Input Delay',
        message: 'Reduce first input delay to improve interactivity.',
        details: [
          'Code-split large JavaScript bundles',
          'Defer non-critical JavaScript',
          'Move heavy computation to web workers',
          'Minimize main thread work during page load'
        ]
      });
    }

    const cls = webVitals.cls && webVitals.cls.value;
    if (cls !== null && cls !== undefined && cls > 0.1) {
      suggestions.push({
        severity: cls >= 0.25 ? 'high' : 'medium',
        category: 'Web Vitals',
        title: 'Reduce Cumulative Layout Shift',
        message: 'Reduce cumulative layout shift to improve visual stability.',
        details: [
          'Set explicit width and height on images and videos',
          'Avoid inserting content above existing content',
          'Use CSS transform for animations instead of layout-affecting properties',
          'Reserve space for dynamically injected content'
        ]
      });
    }

    const inp = webVitals.inp && webVitals.inp.value;
    if (inp !== null && inp !== undefined && inp > 200) {
      suggestions.push({
        severity: inp >= 500 ? 'high' : 'medium',
        category: 'Web Vitals',
        title: 'Improve Interaction to Next Paint',
        message: 'Improve interaction responsiveness to enhance user experience.',
        details: [
          'Debounce frequent event handlers',
          'Reduce JavaScript execution time per interaction',
          'Yield to main thread with scheduler.yield() or setTimeout',
          'Avoid synchronous operations in event handlers'
        ]
      });
    }

    const ttfb = webVitals.ttfb && webVitals.ttfb.value;
    if (ttfb !== null && ttfb !== undefined && ttfb > 800) {
      suggestions.push({
        severity: ttfb >= 1800 ? 'high' : 'medium',
        category: 'Web Vitals',
        title: 'Reduce Server Response Time',
        message: 'Reduce server response time (TTFB) for faster initial load.',
        details: [
          'Use a CDN to serve content closer to users',
          'Enable HTTP caching with appropriate cache headers',
          'Optimize server-side processing and database queries',
          'Use HTTP/2 or HTTP/3'
        ]
      });
    }

    const fcp = webVitals.fcp && webVitals.fcp.value;
    if (fcp !== null && fcp !== undefined && fcp > 1800) {
      suggestions.push({
        severity: fcp >= 3000 ? 'high' : 'medium',
        category: 'Web Vitals',
        title: 'Improve First Contentful Paint',
        message: 'Improve first contentful paint to render content faster.',
        details: [
          'Inline critical CSS to eliminate render-blocking stylesheets',
          'Reduce the number of render-blocking resources',
          'Preconnect to required origins',
          'Minimize server response times'
        ]
      });
    }

    const tbt = mainThread.tbt && mainThread.tbt.value;
    if (tbt !== null && tbt !== undefined && tbt > 200) {
      suggestions.push({
        severity: tbt >= 600 ? 'high' : 'medium',
        category: 'Main Thread',
        title: 'Reduce Total Blocking Time',
        message: 'Reduce total blocking time to improve responsiveness.',
        details: [
          'Break up long tasks into smaller, asynchronous chunks',
          'Use requestIdleCallback for non-critical work',
          'Defer or remove unnecessary third-party scripts',
          'Move heavy computation off the main thread using web workers'
        ]
      });
    }

    const longTaskCount = mainThread.longTaskCount && mainThread.longTaskCount.value;
    if (longTaskCount !== null && longTaskCount !== undefined && longTaskCount > 3) {
      suggestions.push({
        severity: longTaskCount >= 10 ? 'high' : 'medium',
        category: 'Main Thread',
        title: 'Multiple Long Tasks Detected',
        message: 'Multiple long tasks detected — optimize JavaScript execution.',
        details: [
          'Use code splitting to load only what is needed',
          'Implement lazy loading for below-the-fold content',
          'Profile with Chrome DevTools Performance panel to identify bottlenecks',
          'Consider using a web worker for CPU-intensive operations'
        ]
      });
    }

    suggestions.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    });

    return suggestions;
  }
}
