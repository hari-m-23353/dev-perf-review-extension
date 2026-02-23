class ScoreEngine {
  static calculate(report) {
    const webVitalsScore = ScoreEngine._scoreWebVitals(report);
    const mainThreadScore = ScoreEngine._scoreMainThread(report);
    const otherScore = 70;

    const overall = Math.round(
      webVitalsScore * 0.5 +
      mainThreadScore * 0.3 +
      otherScore * 0.2
    );

    return {
      overall: Math.max(0, Math.min(100, overall)),
      breakdown: {
        webVitals: Math.round(webVitalsScore),
        mainThread: Math.round(mainThreadScore),
        other: otherScore
      }
    };
  }

  static _scoreWebVitals(report) {
    const metrics = report.categories && report.categories.webVitals
      ? report.categories.webVitals.metrics
      : {};

    const scores = [];

    const lcp = metrics.lcp && metrics.lcp.value;
    if (lcp !== null && lcp !== undefined) {
      scores.push(lcp < 2500 ? 100 : lcp < 4000 ? 50 : 0);
    }

    const fid = metrics.fid && metrics.fid.value;
    if (fid !== null && fid !== undefined) {
      scores.push(fid < 100 ? 100 : fid < 300 ? 50 : 0);
    }

    const cls = metrics.cls && metrics.cls.value;
    if (cls !== null && cls !== undefined) {
      scores.push(cls < 0.1 ? 100 : cls < 0.25 ? 50 : 0);
    }

    const inp = metrics.inp && metrics.inp.value;
    if (inp !== null && inp !== undefined) {
      scores.push(inp < 200 ? 100 : inp < 500 ? 50 : 0);
    }

    const ttfb = metrics.ttfb && metrics.ttfb.value;
    if (ttfb !== null && ttfb !== undefined) {
      scores.push(ttfb < 800 ? 100 : ttfb < 1800 ? 50 : 0);
    }

    const fcp = metrics.fcp && metrics.fcp.value;
    if (fcp !== null && fcp !== undefined) {
      scores.push(fcp < 1800 ? 100 : fcp < 3000 ? 50 : 0);
    }

    if (scores.length === 0) return 50;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  static _scoreMainThread(report) {
    const metrics = report.categories && report.categories.mainThread
      ? report.categories.mainThread.metrics
      : {};

    const scores = [];

    const tbt = metrics.tbt && metrics.tbt.value;
    if (tbt !== null && tbt !== undefined) {
      scores.push(tbt < 200 ? 100 : tbt < 600 ? 50 : 0);
    }

    const count = metrics.longTaskCount && metrics.longTaskCount.value;
    if (count !== null && count !== undefined) {
      scores.push(
        count === 0 ? 100 :
        count < 3 ? 75 :
        count < 5 ? 50 :
        count < 10 ? 25 : 0
      );
    }

    if (scores.length === 0) return 50;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}
