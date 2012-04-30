function init(query) {
  hatenaManager.syncLoginInfo().next(function() {
    if(hatenaManager.getHatenaId()) {
      hatenaManager.search(query)
      .next(function() {
        var result = hatenaManager.getResult();
        var template = templateManager.getTemplate(templateManager.URL_POPUP_RESULT);
        $("#content-area").html("");
        var i;
        for(i=0; i < result.length; i++) {
          var html = template;
          /*
          html = templateManager.replace(html, "url", result[i].url);
          html = templateManager.replace(html, "title", result[i].title);
          html = templateManager.replace(html, "comment", result[i].comment);
          */
          html = templateManager.replace(html, "url", result.item(i).url);
          html = templateManager.replace(html, "title", result.item(i).title);
          html = templateManager.replace(html, "comment", result.item(i).comment);
          $("#content-area").append(html);
          if(i >= 20) {
            break;
          }
        }
        var htmlCount = templateManager.getTemplate(templateManager.URL_POPUP_COUNT);
        htmlCount = templateManager.replace(htmlCount, "message", result.length + " 件中 " + i + " 件表示しています。");
        htmlCount = templateManager.replace(htmlCount, "id", hatenaManager.getHatenaId());
        $("#count-area").html(htmlCount);
      });
    } else {
      var htmlCount = templateManager.getTemplate(templateManager.URL_POPUP_COUNT);
      htmlCount = templateManager.replace(htmlCount, "message", "ログインしてください。");
      htmlCount = templateManager.replace(htmlCount, "id", "");
      $("#count-area").html(htmlCount);
    }
  });
}

$(function() {
  $("#q").bind("textchange", function(event, previousText) {
    init($(this).val());
  });
  chrome.tabs.getSelected(null,function(tab) {
    var url = tab.url;
    if(urlManager.isGoogle(url)) {
      var query = urlManager.getGoogleQuery(url);
      $("#q").val(query);
      init(query);
    } else {
      init();  
    }
  });  
})
