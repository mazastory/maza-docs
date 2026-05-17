(async () => {
  const src = chrome.runtime.getURL('content/injector.js');
  await import(src);
})();
