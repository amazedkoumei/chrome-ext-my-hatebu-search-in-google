chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  try {
    if(urlManager.isGoogle(tab.url)) {
      var query = urlManager.getGoogleQuery(tab.url);
      globalQuery = query;
      hatenaManager.setQuery(query);
      hatenaManager.search(query)
      .next(function() {
        var result = hatenaManager.getResult();
        chrome.browserAction.setBadgeText({"text":String(result.length), "tabId":tabId});
      });
    }
  } catch(e) {
    console.log(e);
  }
});
chrome.tabs.onCreated.addListener(function(tab) {
  hatenaManager.init();
});
