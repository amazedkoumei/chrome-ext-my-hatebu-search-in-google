/*!
 * hatenaManager JavaScript Library v0.1
 *
 * Copyright (c) 2012 amazedkoumei (Twitter: @amazedkoumei, Blog:http://blog.amazedkoumei.com)
 * Licensed under the MIT license + "keep this comment block even if you modify it".
 *
 * History:
 *  05-03-2012 new created
 */
var hatenaManager = $({});
hatenaManager.MY_NAME_URL = 'http://b.hatena.ne.jp/my.name';

$.extend(hatenaManager, {
  result : {},
  query : "",
  hatenaId: "",
  SearchDataUrl: "",
  syncLoginInfo : function() {
    var self = hatenaManager;
    var ret = false;
    return $.ajax({
      url: hatenaManager.MY_NAME_URL
      ,cache: false
    }).next(function(data){
        try {
          if(data.login) {
            ret = data.login == 1;
            if(ret) {
              self.setHatenaId(data.name);
              self.setSearchDataUrl(data.name);
            } else {
              self.setHatenaId("");
              self.setSearchDataUrl("");
            }
          } else {
            self.setHatenaId("");
            self.setSearchDataUrl("");
          }
        } catch(e) {
          console.log(e);
          self.setHatenaId("");
          self.setSearchDataUrl("");
        }
    }).error(function(e) {
      console.log("error!" + e);
    });
  },
  setHatenaId : function(id){
    hatenaManager.hatenaId = id;
  },
  getHatenaId : function() {
    return hatenaManager.hatenaId;
  },
  setSearchDataUrl : function(id){
    if(id) {
      hatenaManager.searchDataUrl = "http://b.hatena.ne.jp/" + id + "/search.data";
    } else {
      hatenaManager.searchDataUrl = "";
    }
  },
  getSearchDataUrl : function() {
    //hatenaManager.syncLoginInfo();
    return hatenaManager.searchDataUrl;
  },
  init : function() {
    var self = hatenaManager;
    self.syncLoginInfo().next(function(){
      self.syncBookmark();
    }).next(function(){
      if(!self.getHatenaId()) {
        chrome.browserAction.setBadgeText({"text":"!"});
      } else {
        chrome.browserAction.setBadgeText({"text":""});
      }
    });
  },
  syncBookmark : function() {
    var self = hatenaManager;
    var url = self.getSearchDataUrl();
    if(url) {
      return $.ajax({ 
        url: self.getSearchDataUrl()
        , cache: false 
      }).next(function(data) {
        db.transaction(function() {
          Bookmark.dropTable()
          .next(Bookmark.createTable)
          .next(function() {
            datalist = data.split("\n");
            //console.log("data size:" + datalist.length);
            for(var i = 0; i < datalist.length; i++) {
              var title = datalist[ i*3 + 0];
              var comment = datalist[ i*3 + 1];
              var url = datalist[ i*3 + 2];

              var b = new Bookmark();
              b.title = title;
              b.comment = comment;
              b.url = url;
              if(url && url.indexOf("http") == 0) {
                try {
                  //console.log("will save" + i + [url, title, comment].toString());
                  b.save()
                  .error(function(e) {
                    console.error('error: ' + e.message);
                  });
                } catch(e) {
                }
              } else {
                console.log("finish making database");
                break;
              }
            }
          }).error(function(e) {
            console.log("error!!!" + e.message);
          });
        });
      });
    } else {
      return db.transaction(function() {
        Bookmark.dropTable().next(Bookmark.createTable);
        console.log("drop database");
      });
    }
  },
  search : function(q) {
    var self = hatenaManager;
    var where;
    if(q) {
      hatenaManager.setQuery(q);
      where = " WHERE";
      var queryList = q.split(/\s/);
      var title,url,comment;
      for(var i = 0; i < queryList.length; i++) {
        if(i > 0) where += " AND";
        where += " (title LIKE '%" + queryList[i] + "%' or";
        where += " url LIKE '%" + queryList[i] + "%' or";
        where += " comment LIKE '%" + queryList[i] + "%')";
      }
    } else {
      where ="";
    }
    return db.transaction(function(tx){
      tx.execute("SELECT * FROM Bookmark" + where)
      .next(function(res) {
        hatenaManager.setResult(res.rows);
      }).error(function(e) {
        console.log(e.message);
      });
    });
  },
  setResult : function(res) {
    hatenaManager.result = res;
  },
  getResult : function() {
    return hatenaManager.result;
  },
  setQuery : function(query) {
    hatenaManager.query = query;
  },
  getQuery : function() {
    return hatenaManager.query;
  }
});