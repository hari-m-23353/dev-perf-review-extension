class ReportGenerator {
  static generate(data) {
    const { webVitals, longTasks, timestamp, url } = data;

    const webVitalsCategory = ReportGenerator._generateWebVitals(webVitals);
    const mainThreadCategory = ReportGenerator._generateMainThread(longTasks);

    const startTime = data.startTime || (timestamp - 5000);
    const duration = timestamp - startTime;

    return {
      categories: {
        webVitals: webVitalsCategory,
        mainThread: mainThreadCategory
      },
      meta: {
        url,
        timestamp,
        duration
      }
    };
  }

  static _rate(value, good, poor) {
    if (value === null || value === undefined) return 'good';
    if (value <= good) return 'good';
    if (value < poor) return 'warning';
    return 'critical';
  }

  static _generateWebVitals(webVitals) {
    const lcp = webVitals ? webVitals.lcp : null;
    const fid = webVitals ? webVitals.fid : null;
    const cls = webVitals ? webVitals.cls : null;
    const inp = webVitals ? webVitals.inp : null;
    const ttfb = webVitals ? webVitals.ttfb : null;
    const fcp = webVitals ? webVitals.fcp : null;

    const metrics = {
      lcp: { value: lcp, rating: ReportGenerator._rate(lcp, 2500, 4000) },
      fid: { value: fid, rating: ReportGenerator._rate(fid, 100, 300) },
      cls: { value: cls, rating: ReportGenerator._rate(cls, 0.1, 0.25) },
      inp: { value: inp, rating: ReportGenerator._rate(inp, 200, 500) },
      ttfb: { value: ttfb, rating: ReportGenerator._rate(ttfb, 800, 1800) },
      fcp: { value: fcp, rating: ReportGenerator._rate(fcp, 1800, 3000) }
    };

    const ratings = Object.values(metrics).map(m => m.rating);
    const status = ratings.includes('critical') ? 'critical'
      : ratings.includes('warning') ? 'warning' : 'good';

    const summaryParts = [];
    if (lcp !== null) summaryParts.push('LCP: ' + (lcp < 2500 ? 'Good' : lcp < 4000 ? 'Needs improvement' : 'Poor'));
    if (cls !== null) summaryParts.push('CLS: ' + (cls < 0.1 ? 'Good' : cls < 0.25 ? 'Needs improvement' : 'Poor'));

    return {
      status,
      metrics,
      summary: summaryParts.length > 0 ? summaryParts.join(', ') : 'Web Vitals collected'
    };
  }

  static _generateMainThread(longTasks) {
    const tbt = longTasks ? longTasks.totalBlockingTime : null;
    const count = longTasks ? longTasks.count : null;

    const metrics = {
      tbt: { value: tbt, rating: ReportGenerator._rate(tbt, 200, 600) },
      longTaskCount: { value: count, rating: ReportGenerator._rateCount(count) }
    };

    const ratings = Object.values(metrics).map(m => m.rating);
    const status = ratings.includes('critical') ? 'critical'
      : ratings.includes('warning') ? 'warning' : 'good';

    return {
      status,
      metrics,
      summary: 'TBT: ' + (tbt !== null ? Math.round(tbt) + 'ms' : 'N/A') +
        ', Long Tasks: ' + (count !== null ? count : 'N/A')
    };
  }

  static _rateCount(count) {
    if (count === null || count === undefined) return 'good';
    if (count === 0) return 'good';
    if (count < 3) return 'warning';
    return 'critical';
  }
}
