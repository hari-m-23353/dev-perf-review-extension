class SuggestionList {
  render(suggestions) {
    const container = document.createElement('div');
    container.className = 'suggestion-list';

    const header = document.createElement('h3');
    header.className = 'suggestion-list__header';
    header.textContent = '💡 Actionable Suggestions';
    container.appendChild(header);

    if (!suggestions || suggestions.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'suggestion-list__empty';
      empty.textContent = '🟢 No issues found. Great performance!';
      container.appendChild(empty);
      return container;
    }

    const sorted = suggestions.slice().sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.severity] || 1) - (order[b.severity] || 1);
    });

    for (const suggestion of sorted) {
      const item = this._renderSuggestion(suggestion);
      container.appendChild(item);
    }

    return container;
  }

  _renderSuggestion(suggestion) {
    const item = document.createElement('div');
    item.className = 'suggestion-item suggestion-item--' + suggestion.severity;

    const itemHeader = document.createElement('div');
    itemHeader.className = 'suggestion-item__header';

    const severityBadge = document.createElement('span');
    severityBadge.className = 'suggestion-item__severity badge--' + suggestion.severity;
    severityBadge.textContent = suggestion.severity.toUpperCase();

    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'suggestion-item__category';
    categoryBadge.textContent = suggestion.category;

    const title = document.createElement('strong');
    title.className = 'suggestion-item__title';
    title.textContent = suggestion.title;

    itemHeader.appendChild(severityBadge);
    itemHeader.appendChild(categoryBadge);
    item.appendChild(itemHeader);
    item.appendChild(title);

    const message = document.createElement('p');
    message.className = 'suggestion-item__message';
    message.textContent = suggestion.message;
    item.appendChild(message);

    if (suggestion.details && suggestion.details.length > 0) {
      const detailsList = document.createElement('ul');
      detailsList.className = 'suggestion-item__details';
      for (const detail of suggestion.details) {
        const li = document.createElement('li');
        li.textContent = detail;
        detailsList.appendChild(li);
      }
      item.appendChild(detailsList);
    }

    return item;
  }
}
