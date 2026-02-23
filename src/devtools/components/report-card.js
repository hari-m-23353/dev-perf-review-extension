class ReportCard {
  render(category, data) {
    const card = document.createElement('div');
    card.className = 'report-card';

    const header = document.createElement('div');
    header.className = 'report-card__header';

    const emoji = document.createElement('span');
    emoji.className = 'report-card__emoji';
    emoji.textContent = this._getStatusEmoji(data.status);

    const title = document.createElement('h3');
    title.className = 'report-card__title';
    title.textContent = category;

    const summary = document.createElement('p');
    summary.className = 'report-card__summary';
    summary.textContent = data.summary || '';

    header.appendChild(emoji);
    header.appendChild(title);
    card.appendChild(header);
    card.appendChild(summary);

    if (data.metrics && Object.keys(data.metrics).length > 0) {
      const metricsEl = this._renderMetrics(data.metrics);
      card.appendChild(metricsEl);
    }

    return card;
  }

  _renderMetrics(metrics) {
    const container = document.createElement('div');
    container.className = 'report-card__metrics';

    for (const [key, metric] of Object.entries(metrics)) {
      if (metric.value === null || metric.value === undefined) continue;

      const row = document.createElement('div');
      row.className = 'metric-row metric-row--' + (metric.rating || 'good');

      const label = document.createElement('span');
      label.className = 'metric-row__label';
      label.textContent = key.toUpperCase();

      const value = document.createElement('span');
      value.className = 'metric-row__value';
      value.textContent = this._formatValue(key, metric.value);

      const badge = document.createElement('span');
      badge.className = 'metric-row__badge badge--' + (metric.rating || 'good');
      badge.textContent = metric.rating || 'good';

      row.appendChild(label);
      row.appendChild(value);
      row.appendChild(badge);
      container.appendChild(row);
    }

    return container;
  }

  _formatValue(key, value) {
    if (key === 'cls') {
      return value.toFixed(2);
    }
    if (key === 'longTaskCount' || key === 'count') {
      return String(value);
    }
    if (typeof value === 'number') {
      if (value >= 1000) {
        return (value / 1000).toFixed(2) + 's';
      }
      return Math.round(value) + 'ms';
    }
    return String(value);
  }

  _getStatusEmoji(status) {
    const emojis = { good: '🟢', warning: '⚠️', critical: '🔴' };
    return emojis[status] || '⚪';
  }
}
