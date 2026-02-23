function formatDuration(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  if (ms >= 1000) {
    return (ms / 1000).toFixed(2) + 's';
  }
  return Math.round(ms) + 'ms';
}

function formatCLS(value) {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(2);
}

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return 'N/A';
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }
  return bytes + ' B';
}

function formatScore(score) {
  return Math.round(score) + '/100';
}

function getRatingClass(rating) {
  const classes = {
    good: 'status-good',
    warning: 'status-warning',
    critical: 'status-critical'
  };
  return classes[rating] || 'status-unknown';
}

function getStatusEmoji(status) {
  const emojis = {
    good: '🟢',
    warning: '⚠️',
    critical: '🔴'
  };
  return emojis[status] || '⚪';
}
