// Service Worker — Dev Performance Review Extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_REVIEW') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        chrome.runtime.sendMessage({ type: 'REVIEW_ERROR', data: { error: 'No active tab found' } });
        return;
      }
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { type: 'START_REVIEW' }, (response) => {
        if (chrome.runtime.lastError) {
          chrome.runtime.sendMessage({
            type: 'REVIEW_ERROR',
            data: { error: chrome.runtime.lastError.message }
          });
        }
      });
    });
  }

  if (message.type === 'REVIEW_COMPLETE') {
    chrome.runtime.sendMessage({ type: 'REVIEW_COMPLETE', data: message.data });
  }

  if (message.type === 'REVIEW_ERROR') {
    chrome.runtime.sendMessage({ type: 'REVIEW_ERROR', data: message.data });
  }
});
