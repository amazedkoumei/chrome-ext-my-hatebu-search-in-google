/*!
 * templateManager JavaScript Library v0.1
 *
 * Copyright (c) 2012 amazedkoumei (Twitter: @amazedkoumei, Blog:http://blog.amazedkoumei.com)
 * Licensed under the MIT license + "keep this comment block even if you modify it".
 *
 * History:
 *  05-03-2012 new created
 */
var templateManager = $({});
templateManager.URL_POPUP_RESULT = '../template/popup-result.html';
templateManager.URL_POPUP_COUNT = '../template/popup-count.html';

$.extend(templateManager, {
  init : function() {

  },
  getTemplate : function(url) {
    var self = templateManager;
    var template;
    $.ajax({
      url: url
      ,async: false
      ,cache: false
      ,complete: function(data) {
        if(data.responseText) {
          template = data.responseText;
        } else {
          //TODO
        }
      }
    });
    return template;
  },
  replace : function(template, from, to) {
    from = "@." + from + "@";
    var reg = new RegExp(from, "g");
    return template.replace(reg, to);
  }

});
templateManager.init();