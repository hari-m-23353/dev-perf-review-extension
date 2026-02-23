class ScoreGauge {
  render(score) {
    const container = document.createElement('div');
    container.className = 'score-gauge';

    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
    const color = clampedScore >= 80 ? '#a6e3a1'
      : clampedScore >= 50 ? '#f9e2af'
      : '#f38ba8';

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedScore / 100) * circumference;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '120');
    svg.className = 'score-gauge__svg';

    const trackCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    trackCircle.setAttribute('cx', '60');
    trackCircle.setAttribute('cy', '60');
    trackCircle.setAttribute('r', String(radius));
    trackCircle.setAttribute('fill', 'none');
    trackCircle.setAttribute('stroke', '#45475a');
    trackCircle.setAttribute('stroke-width', '10');

    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '60');
    progressCircle.setAttribute('cy', '60');
    progressCircle.setAttribute('r', String(radius));
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', color);
    progressCircle.setAttribute('stroke-width', '10');
    progressCircle.setAttribute('stroke-dasharray', String(circumference));
    progressCircle.setAttribute('stroke-dashoffset', String(offset));
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('transform', 'rotate(-90 60 60)');

    const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scoreText.setAttribute('x', '60');
    scoreText.setAttribute('y', '60');
    scoreText.setAttribute('text-anchor', 'middle');
    scoreText.setAttribute('dominant-baseline', 'central');
    scoreText.setAttribute('fill', color);
    scoreText.setAttribute('font-size', '22');
    scoreText.setAttribute('font-weight', 'bold');
    scoreText.textContent = String(clampedScore);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '60');
    label.setAttribute('y', '80');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#a6adc8');
    label.setAttribute('font-size', '10');
    label.textContent = '/100';

    svg.appendChild(trackCircle);
    svg.appendChild(progressCircle);
    svg.appendChild(scoreText);
    svg.appendChild(label);

    const title = document.createElement('p');
    title.className = 'score-gauge__title';
    title.textContent = 'Overall Score';

    container.appendChild(svg);
    container.appendChild(title);

    return container;
  }
}
