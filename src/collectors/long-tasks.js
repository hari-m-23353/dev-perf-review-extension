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
    } catch (e) {
      // longtask not supported
    }
  }

  stop() {
    if (this._observer) {
      try {
        this._observer.disconnect();
      } catch (e) {
        // ignore
      }
      this._observer = null;
    }
  }

  getResults() {
    const totalBlockingTime = this._tasks.reduce((sum, task) => {
      return sum + Math.max(0, task.duration - 50);
    }, 0);

    return {
      tasks: this._tasks.slice(),
      totalBlockingTime,
      count: this._tasks.length
    };
  }
}
