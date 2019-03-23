'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'tripleClickEnabled': true}, function() {
    console.log('triple click to pop content is enabled.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {schemes: ['http','https','file']},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
