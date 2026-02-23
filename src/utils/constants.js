const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
  TBT: { good: 200, poor: 600 },
  LONG_TASK_COUNT: { good: 0, warning: 3, poor: 10 }
};

const COLLECTION_DURATION = 5000;

const MESSAGE_TYPES = {
  START_REVIEW: 'START_REVIEW',
  REVIEW_COMPLETE: 'REVIEW_COMPLETE',
  REVIEW_ERROR: 'REVIEW_ERROR'
};

const RATINGS = {
  GOOD: 'good',
  WARNING: 'warning',
  CRITICAL: 'critical'
};

const SCORE_WEIGHTS = {
  webVitals: 0.5,
  mainThread: 0.3,
  other: 0.2
};
