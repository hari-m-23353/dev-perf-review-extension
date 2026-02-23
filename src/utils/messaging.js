function sendMessage(type, data) {
  return chrome.runtime.sendMessage({ type, data });
}

function sendToTab(tabId, type, data) {
  return chrome.tabs.sendMessage(tabId, { type, data });
}

function onMessage(type, callback) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === type) {
      callback(message, sender, sendResponse);
    }
  });
}
