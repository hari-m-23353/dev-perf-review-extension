class WebVitalsCollector {
  constructor() {
    this._observers = [];
    this._results = {
      lcp: null,
      fid: null,
      cls: 0,
      inp: null,
      ttfb: null,
      fcp: null
    };
  }

  start() {
    this._observeLCP();
    this._observeFID();
    this._observeCLS();
    this._observeINP();
    this._observeTTFB();
    this._observeFCP();
  }

  _observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          this._results.lcp = entry.startTime;
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this._observers.push(observer);
    } catch (e) {
      // LCP not supported
    }
  }

  _observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const entry = entries[0];
          this._results.fid = entry.processingStart - entry.startTime;
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
      this._observers.push(observer);
    } catch (e) {
      // FID not supported
    }
  }

  _observeCLS() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            this._results.cls += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      this._observers.push(observer);
    } catch (e) {
      // CLS not supported
    }
  }

  _observeINP() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.processingEnd
            ? entry.processingEnd - entry.startTime
            : entry.duration;
          if (this._results.inp === null || duration > this._results.inp) {
            this._results.inp = duration;
          }
        }
      });
      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      this._observers.push(observer);
    } catch (e) {
      // INP/event not supported
    }
  }

  _observeTTFB() {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        this._results.ttfb = nav.responseStart - nav.requestStart;
      }
    } catch (e) {
      // TTFB not available
    }
  }

  _observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this._results.fcp = entry.startTime;
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
      this._observers.push(observer);
    } catch (e) {
      // FCP not supported
    }
  }

  stop() {
    for (const observer of this._observers) {
      try {
        observer.disconnect();
      } catch (e) {
        // ignore
      }
    }
    this._observers = [];
  }

  getResults() {
    return {
      lcp: this._results.lcp,
      fid: this._results.fid,
      cls: this._results.cls,
      inp: this._results.inp,
      ttfb: this._results.ttfb,
      fcp: this._results.fcp
    };
  }
}
