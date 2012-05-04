/*!
 * urlManager JavaScript Library v0.1
 *
 * Copyright (c) 2012 amazedkoumei (Twitter: @amazedkoumei, Blog:http://blog.amazedkoumei.com)
 * Licensed under the MIT license + "keep this comment block even if you modify it".
 *
 * History:
 *  05-03-2012 new created
 */
var urlManager = $({});

$.extend(urlManager, {
  isGoogle: function(url) {
    return url.match(/https?:\/\/www.google*/) != null;
  },
  getGoogleQuery: function(url) {
    var quPattern = new RegExp(/http.*\?.*&qu=(.+?)(&.*|#.*|$)/);
    var qPattern = new RegExp(/http.*\?.*&q=(.+?)(&.*|#.*|$)/);

    // アドレスバーではなくGoogle検索窓で複数ワード検索した時に区切り文字が+になる。
    // 検索ワード自体に含まれる+文字はURLエンコードされる（%2B）
    url = url.replace(/\+/g, " ");
    
    url = decodeURIComponent(url);
    if(url.match(quPattern) || url.match(qPattern)) {
      return RegExp.$1;
    } else {
      return "";
    }
  }
});