# Dev Performance Review Extension

A Chrome DevTools Extension (Manifest V3, Vanilla JS, zero dependencies) that captures Web Vitals and Long Tasks, renders a performance review report in a DevTools panel, and provides an overall performance score with actionable suggestions.

## Architecture Overview

```
Panel (panel.js)
  ──[START_REVIEW]──▶ Service Worker (service-worker.js)
                        ──[START_REVIEW]──▶ Content Script (content-script.js)
                                              │
                                              ├─ WebVitalsCollector.start()
                                              ├─ LongTasksCollector.start()
                                              │   ... 5 seconds ...
                                              ├─ WebVitalsCollector.stop()
                                              ├─ LongTasksCollector.stop()
                                              │
                        ◀──[REVIEW_COMPLETE]── Content Script
  ◀──[REVIEW_COMPLETE]── Service Worker
  │
  ├─ ReportGenerator.generate(data)
  ├─ ScoreEngine.calculate(report)
  ├─ SuggestionEngine.generate(report)
  ├─ Render ScoreGauge, ReportCards, SuggestionList
  └─ Enable Export
```

### Directory Structure

```
dev-perf-review-extension/
├── manifest.json
├── assets/
│   ├── icons/              # Extension icons (16, 48, 128px)
│   └── styles/
│       └── theme.css       # CSS custom properties (dark theme)
└── src/
    ├── background/
    │   └── service-worker.js
    ├── content/
    │   └── content-script.js
    ├── collectors/
    │   ├── web-vitals.js   # PerformanceObserver-based Web Vitals
    │   └── long-tasks.js   # Long Tasks / TBT collector
    ├── analyzers/
    │   └── score-engine.js # Weighted scoring (0–100)
    ├── reporters/
    │   ├── report-generator.js
    │   └── suggestion-engine.js
    ├── utils/
    │   ├── constants.js
    │   ├── messaging.js
    │   └── formatters.js
    └── devtools/
        ├── devtools.html
        ├── devtools.js
        ├── panel/
        │   ├── panel.html
        │   ├── panel.js
        │   └── panel.css
        └── components/
            ├── report-card.js
            ├── score-gauge.js
            └── suggestion-list.js
```

## How to Install

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the root of this repository.
5. The extension will appear in your extensions list.

## How to Use

1. Open Chrome DevTools (`F12` or right-click → Inspect).
2. Find the **Perf Review** tab in the DevTools panel bar.
3. Navigate to the page you want to audit.
4. Click **▶ Run Review** — the extension collects data for 5 seconds.
5. View your performance score, metric breakdowns, and actionable suggestions.
6. Click **⬇ Export Report (JSON)** to download the full report.

## Metrics Collected

| Metric | Good | Warning | Poor |
|--------|------|---------|------|
| LCP    | < 2.5s | < 4s | ≥ 4s |
| FID    | < 100ms | < 300ms | ≥ 300ms |
| CLS    | < 0.1 | < 0.25 | ≥ 0.25 |
| INP    | < 200ms | < 500ms | ≥ 500ms |
| TTFB   | < 800ms | < 1800ms | ≥ 1800ms |
| FCP    | < 1800ms | < 3000ms | ≥ 3000ms |
| TBT    | < 200ms | < 600ms | ≥ 600ms |

## Scoring

Overall score (0–100) is a weighted average:
- **Web Vitals**: 50%
- **Main Thread** (Long Tasks / TBT): 30%
- **Other** (reserved for Phase 2+): 20%

## Phase Roadmap

- **Phase 1** ✅ — Web Vitals, Long Tasks, Score Engine, Suggestions, DevTools Panel
- **Phase 2** — Network waterfall, resource analysis
- **Phase 3** — Historical trend tracking
- **Phase 4** — CI integration export

## Tech Stack

- **Vanilla JS** — zero dependencies, no bundler
- **Chrome Manifest V3** — service worker, `chrome.scripting` API
- **PerformanceObserver API** — for Web Vitals and Long Tasks