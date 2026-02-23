(function () {
  'use strict';

  const runBtn = document.getElementById('runReviewBtn');
  const statusArea = document.getElementById('statusArea');
  const reportContainer = document.getElementById('reportContainer');
  const scoreArea = document.getElementById('scoreArea');
  const cardsArea = document.getElementById('cardsArea');
  const suggestionsArea = document.getElementById('suggestionsArea');
  const exportBtn = document.getElementById('exportBtn');

  let lastReport = null;
  let lastScore = null;
  let lastSuggestions = null;

  function setStatus(message, type) {
    statusArea.textContent = message;
    statusArea.className = 'status-area' + (type ? ' status-area--' + type : '');
  }

  function setLoading(loading) {
    runBtn.disabled = loading;
    runBtn.textContent = loading ? '⏳ Collecting...' : '▶ Run Review';
  }

  function renderReport(report, score, suggestions) {
    scoreArea.innerHTML = '';
    cardsArea.innerHTML = '';
    suggestionsArea.innerHTML = '';

    const gauge = new ScoreGauge();
    scoreArea.appendChild(gauge.render(score.overall));

    const scoreBreakdown = document.createElement('div');
    scoreBreakdown.className = 'score-breakdown';
    scoreBreakdown.innerHTML =
      '<span class="breakdown-item">Web Vitals: <strong>' + score.breakdown.webVitals + '</strong></span>' +
      '<span class="breakdown-item">Main Thread: <strong>' + score.breakdown.mainThread + '</strong></span>';
    scoreArea.appendChild(scoreBreakdown);

    const card = new ReportCard();
    const categories = {
      'Web Vitals': report.categories.webVitals,
      'Main Thread': report.categories.mainThread
    };

    for (const [name, data] of Object.entries(categories)) {
      if (data) {
        cardsArea.appendChild(card.render(name, data));
      }
    }

    const suggList = new SuggestionList();
    suggestionsArea.appendChild(suggList.render(suggestions));

    reportContainer.hidden = false;
  }

  function onReviewComplete(message) {
    const data = message.data;
    try {
      const report = ReportGenerator.generate(data);
      const score = ScoreEngine.calculate(report);
      const suggestions = SuggestionEngine.generate(report);

      lastReport = report;
      lastScore = score;
      lastSuggestions = suggestions;

      setLoading(false);
      setStatus('✅ Review complete for: ' + (data.url || 'page'), 'success');
      renderReport(report, score, suggestions);
    } catch (err) {
      setLoading(false);
      setStatus('❌ Error processing results: ' + err.message, 'error');
    }
  }

  function onReviewError(message) {
    setLoading(false);
    const errMsg = (message.data && message.data.error) || 'Unknown error';
    setStatus('❌ Error: ' + errMsg, 'error');
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MESSAGE_TYPES.REVIEW_COMPLETE) {
      onReviewComplete(message);
    } else if (message.type === MESSAGE_TYPES.REVIEW_ERROR) {
      onReviewError(message);
    }
  });

  runBtn.addEventListener('click', () => {
    setLoading(true);
    reportContainer.hidden = true;
    setStatus('⏳ Collecting performance data (5s)...', 'info');

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.START_REVIEW });
  });

  exportBtn.addEventListener('click', () => {
    if (!lastReport) return;

    const exportData = {
      report: lastReport,
      score: lastScore,
      suggestions: lastSuggestions,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perf-review-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  });
})();
