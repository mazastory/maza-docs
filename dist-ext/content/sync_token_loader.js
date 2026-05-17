(async () => {
  const src = chrome.runtime.getURL('content/sync_token.js');
  await import(src);
})();
