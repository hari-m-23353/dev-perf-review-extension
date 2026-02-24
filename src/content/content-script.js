(function () {
  'use strict';

  const COLLECTION_DURATION = 5000;

  class WebVitalsCollector {
    constructor() {
      this._observers = [];
      this._results = { lcp: null, fid: null, cls: 0, inp: null, ttfb: null, fcp: null };
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
          for (const entry of list.getEntries()) {
            this._results.lcp = entry.startTime;
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        this._observers.push(observer);
      } catch (e) {}
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
      } catch (e) {}
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
      } catch (e) {}
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
      } catch (e) {}
    }

    _observeTTFB() {
      try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          this._results.ttfb = nav.responseStart - nav.requestStart;
        }
      } catch (e) {}
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
      } catch (e) {}
    }

    stop() {
      for (const observer of this._observers) {
        try { observer.disconnect(); } catch (e) {}
      }
      this._observers = [];
    }

    getResults() {
      return Object.assign({}, this._results);
    }
  }

  class LongTasksCollector {
    constructor() {
      this._observer = null;
      this._tasks = [];
    }

    start() {
      try {
        this._observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this._tasks.push({
              startTime: entry.startTime,
              duration: entry.duration,
              name: entry.name
            });
          }
        });
        this._observer.observe({ type: 'longtask', buffered: true });
      } catch (e) {}
    }

    stop() {
      if (this._observer) {
        try { this._observer.disconnect(); } catch (e) {}
        this._observer = null;
      }
    }

    getResults() {
      const totalBlockingTime = this._tasks.reduce((sum, task) => {
        return sum + Math.max(0, task.duration - 50);
      }, 0);
      return { tasks: this._tasks.slice(), totalBlockingTime, count: this._tasks.length };
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'START_REVIEW') return false;

    const webVitals = new WebVitalsCollector();
    const longTasks = new LongTasksCollector();
    const startTime = Date.now();

    webVitals.start();
    longTasks.start();

    sendResponse({});

    setTimeout(() => {
      webVitals.stop();
      longTasks.stop();

      chrome.runtime.sendMessage({
        type: 'REVIEW_COMPLETE',
        data: {
          webVitals: webVitals.getResults(),
          longTasks: longTasks.getResults(),
          timestamp: Date.now(),
          startTime,
          url: location.href
        }
      });
    }, COLLECTION_DURATION);
  });
})();
