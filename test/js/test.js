function getLoginMock() {
  return $.mockjax({
    url: hatenaManager.MY_NAME_URL,
    responseTime: 750,
    responseText: {
      facebook_checked: "inherit",
      private: 0,
      name: "amazedkoumei",
      is_oauth_mixi_check: 0,
      mixi_check_checked: "inherit",
      is_oauth_twitter: 1,
      ignores_regex: "dummy",
      rkm: "dummy",
      login: 1,
      rks: "dummy",
      is_oauth_facebook: 0,
      twitter_checked: "inherit",
      plususer: 0,
      bookmark_count: 1954,
      is_staff: 0
    }
  });
}
function getLogoutMock() {
  return $.mockjax({
    url: hatenaManager.MY_NAME_URL,
    responseTime: 750,
    responseText: {
      login: 0
    }
  });
}
function getErrorMock() {
  return $.mockjax({
    url: hatenaManager.MY_NAME_URL,
    responseTime: 750,
  });
}
function getDataMock() {
  var dataMock = $.mockjax({
    url: hatenaManager.getSearchDataUrl(),
    responseTime: 50,
    responseText: "タイトルa"
          + "\nブコメb"
          + "\nhttp://URLc"
          + "\nタイトルd"
          + "\nブコメe"
          + "\nhttp://URLf"
          + "\nタイトルg"
          + "\nブコメh"
          + "\nhttp://URLi"
  });
}
module("Test");
asyncTest("test1", function(){
  setTimeout(function(){
    ok(true, 'asyncTest');
    start();
  }, 10);
});
asyncTest('after test', function() {
  ok(true, 'after test');
  start();
});

module("hatenaManager.js syncLoginInfo");
asyncTest("case of login", function(){
  //モックを作成
  var loginMock = getLoginMock();

  //処理の実行
  hatenaManager.syncLoginInfo().next(function() {
    //評価
    equal(hatenaManager.getHatenaId(), "amazedkoumei", 'IDが正しくセットされる');
    equal(hatenaManager.getSearchDataUrl(), "http://b.hatena.ne.jp/amazedkoumei/search.data", '同期先URLが正しくセットされる');
    //mockのお片づけ
    $.mockjaxClear(loginMock);
    start();
  });
});

asyncTest("case of logout", function(){
  //モックを作成
  var logoutMock = getLogoutMock();

  //処理の実行
  hatenaManager.syncLoginInfo().next(function() {
    //評価
    equal(hatenaManager.getHatenaId(), "", 'IDが空値');
    equal(hatenaManager.getSearchDataUrl(), "", '同期先URLが空値');
    //mockのお片づけ
    $.mockjaxClear(logoutMock);
    start();
  });
});

asyncTest("case of network error", function(){
  //モックを作成
  var errorMock = getErrorMock();

  //処理の実行
  hatenaManager.syncLoginInfo().next(function() {
    //評価
    equal(hatenaManager.getHatenaId(), "", 'IDが空値');
    equal(hatenaManager.getSearchDataUrl(), "", '同期先URLが空値');
    //mockのお片づけ
    $.mockjaxClear(errorMock);
    start();
  });
});

module("hatenaManager.js syncBookmark");
asyncTest("case of login", function(){
  //モックを作成
  var loginMock = getLoginMock();
  var dataMock;
  
  //処理の実行
  hatenaManager.syncLoginInfo()
  .next(function() {
    dataMock = getDataMock();
    hatenaManager.syncBookmark()
    .next(function() {
      Bookmark.count().next(function(c){
        console.log("レコード数のテストを実施: " + c);
        equal(c, 3, 'レコード数');
        console.log("レコード数のテストを終了");
      }).next(function() {
        return Bookmark.findFirst();
      }).next(function(b){
        console.log("最初のレコードのテストを実施");
        ok(true, "最初のレコードのテストを実施");
        equal(b.title, "タイトルa", '最初のレコードのタイトル');
        equal(b.comment, "ブコメb", '最初のレコードのブコメ');
        equal(b.url, "http://URLc", '最初のレコードのURL');
        console.log("最初のレコードのテスト完了");
        $.mockjaxClear(loginMock);
        $.mockjaxClear(dataMock);
        start();
      });
    })
  });
});

asyncTest("case of logout", function(){
  //モックを作成
  var logoutMock = getLogoutMock();

  //処理の実行
  hatenaManager.syncLoginInfo()
  .next(function() {
    dataMock = getDataMock();
    hatenaManager.syncBookmark()
    .next(function() {
      $.mockjaxClear(logoutMock);
      $.mockjaxClear(dataMock);
      Bookmark.count().next(function(c){
        console.log("レコード数のテストを実施: " + c);
        equal(c, 0, 'レコード数');
        console.log("レコード数のテストを終了");
        start();
      });
    });
  });
});

module("hatenaManager.js search");
asyncTest("search", function(){

  var loginMock = getLoginMock();
  var dataMock;

  //処理の実行
  hatenaManager.syncLoginInfo()
  .next(function() {
    dataMock = getDataMock();
    hatenaManager.syncBookmark()
    .next(function() {
      $.mockjaxClear(loginMock);
      $.mockjaxClear(dataMock);
      hatenaManager.search("b").next(function() {
        var ret1 = hatenaManager.getResult();
        equal(ret1.item(0).title, "タイトルa", 'タイトル検索');
        equal(ret1.length, 1, 'タイトル検索結果の件数');
      }).next(function() {
        hatenaManager.search("b").next(function() {
          var ret2 = hatenaManager.getResult();
          equal(ret2.item(0).comment, "ブコメb", 'ブコメ検索');
          equal(ret2.length, 1, 'ブコメ検索結果の件数一致');
        }).next(function() {
          hatenaManager.search("c").next(function() {
            var ret3 = hatenaManager.getResult();
            ok(true, "URL検索")
            equal(ret3.item(0).url, "http://URLc", 'URL検索');
            equal(ret3.length, 1, 'URL検索結果の件数一致');
          }).next(function() {
            hatenaManager.search("d").next(function() {
              var ret4 = hatenaManager.getResult();
              ok(true, "2件目")
              equal(ret4.item(0).title, "タイトルd", '2件目のレコードをタイトル検索');
              equal(ret4.length, 1, '2件目のレコードのタイトル検索結果の件数一致');
            }).next(function() {
              hatenaManager.search().next(function() {
                var ret5 = hatenaManager.getResult();
                ok(true, "空値検索")
                equal(ret5.length, 3, '件数一致');
              }).next(function() {
                hatenaManager.search("hoge").next(function() {
                  var ret6 = hatenaManager.getResult();
                  equal(ret6.length, 0, '検索結果ゼロ件');
                }).next(function() {
                  hatenaManager.search("タイトル d").next(function() {
                    var ret7 = hatenaManager.getResult();
                    equal(ret7.length, 1, '複数キーワード検索の件数一致');
                    equal(ret7.item(0).title, "タイトルd", '複数キーワード検索のタイトル一致');
                    start();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

module("templateManager.js");
asyncTest("", function() {
  //モックを作成
  var id = $.mockjax({
    url: templateManager.URL_POPUP_RESULT,
    responseTime: 50,
    responseText: "<div>@.title@</div><div>@.title@</div>"
  });
  // TODO: 引数なし
  // TODO: AjaxError（不正な引数）
  var template = templateManager.getTemplate(templateManager.URL_POPUP_RESULT);
  equal(template, "<div>@.title@</div><div>@.title@</div>", "getTemplateメソッド");
  var replaced = templateManager.replace(template, "title", "タイトル");
  equal(replaced, "<div>タイトル</div><div>タイトル</div>", "replaceメソッド");
  $.mockjaxClear(id);
  start();
});
module("urlManager.js");
asyncTest("isGoogle", function() {
  var url;

  url = "http://www.google.co.jp";
  equal(urlManager.isGoogle(url), true, url);
  url = "https://www.google.co.jp";
  equal(urlManager.isGoogle(url), true, url);
  url = "http://www.google.com";
  equal(urlManager.isGoogle(url), true, url);
  url = "https://www.google.co.jp/search?ix=seb&sourceid=chrome&ie=UTF-8&q=hoge";

  equal(urlManager.isGoogle(url), true, url);
  url = "https://amazedkoumei.com";
  equal(urlManager.isGoogle(url), false, url);
  start();
});

asyncTest("getGoogleQuery", function() {
  var url;

  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=ja&safe=off&output=search&sclient=psy-ab&q=hoge&oq=&aq=&aqi=&aql=&gs_nf=&gs_l=&pbx=1&fp=be5ac0d5dde5a539&ix=seb&ion=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&biw=1422&bih=734";
  equal(urlManager.getGoogleQuery(url), "hoge", "アドレスバーでの検索");
  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=ja&safe=off&sclient=psy-ab&q=huga&oq=huga&aq=f&aqi=g-r4&aql=&gs_nf=1&gs_l=hp.3..0i4l4.1739.437403.0.438015.5.5.0.0.0.0.167.406.3j1.4.0.pTKNxLLYNxs&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=be5ac0d5dde5a539&ix=seb&ion=1&biw=1422&bih=734";
  equal(urlManager.getGoogleQuery(url), "huga", "Google検索結果ページでの検索");
  url = "https://www.google.co.jp/search?ix=seb&sourceid=chrome&ie=UTF-8&q=%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%9E%E3%83%AC%E3%82%B9";
  equal(urlManager.getGoogleQuery(url), "スキーマレス", "アドレスバーでの日本語検索");
  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=sea&ie=UTF-8&ion=1#hl=ja&safe=off&sclient=psy-ab&q=%E3%83%9E%E3%83%BC%E3%82%B8&oq=%E3%83%9E%E3%83%BC%E3%82%B8&aq=f&aqi=g-r4&aql=&gs_l=hp.3..0i4l4.1807.8571.0.9099.12.10.0.0.0.2.202.847.6j1j1.9.0...0.0.O5-2_mZ_oeY&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=d0fd4449f364d857&ix=sea&ion=1&biw=1422&bih=783";
  equal(urlManager.getGoogleQuery(url), "マージ", "Google検索結果ページでの日本語検索");
  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=sea&ie=UTF-8&ion=1#hl=ja&safe=off&output=search&sclient=psy-ab&q=github%20pull%20request&oq=&aq=&aqi=&aql=&gs_l=&pbx=1&fp=d0fd4449f364d857&ix=sea&ion=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&biw=1422&bih=783";
  equal(urlManager.getGoogleQuery(url), "github pull request", "アドレスバーでの複数ワード検索");
  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=sea&ie=UTF-8&ion=1#hl=ja&gs_nf=1&gs_is=1&pq=github%20pull%20request&cp=9&gs_id=at&xhr=t&q=google%2B+%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB&pf=p&safe=off&sclient=psy-ab&oq=google%2B+%E3%81%95&aq=0r&aqi=g-r4&aql=&gs_l=&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=d0fd4449f364d857&ix=sea&ion=1&biw=1422&bih=783";
  equal(urlManager.getGoogleQuery(url), "google+ サークル", "Google検索結果ページでの複数ワード検索");
  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=sea&ie=UTF-8&ion=1#hl=ja&safe=off&output=search&sclient=psy-ab&q=github%E3%80%80pull%E3%80%80request&oq=&aq=&aqi=&aql=&gs_l=&pbx=1&fp=d0fd4449f364d857&ix=sea&ion=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&biw=1422&bih=783";
  equal(urlManager.getGoogleQuery(url), "github　pull　request", "アドレスバーでの全角区切りでの複数ワード検索");
  url = "https://www.google.co.jp/webhp?sourceid=chrome-instant&ix=sea&ie=UTF-8&ion=1#hl=ja&gs_nf=1&gs_is=1&pq=github%E3%80%80pull%E3%80%80request&cp=9&gs_id=117&xhr=t&q=google%2B+%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB&pf=p&safe=off&sclient=psy-ab&oq=google%2B%E3%80%80%E3%81%95&aq=0r&aqi=g-r4&aql=&gs_l=&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=d0fd4449f364d857&ix=sea&ion=1&biw=1422&bih=783&bs=1";
  equal(urlManager.getGoogleQuery(url), "google+ サークル", "Google検索結果ページでの全角区切りでの複数ワード検索");
  url = "https://www.google.co.jp/search?aq=f&sourceid=chrome&ie=UTF-8&q=jquery#q=jquery&hl=ja&safe=off&prmd=imvnsb&source=lnt&tbs=qdr:h&sa=X&ei=2cSgT4D1F4jRmAW989W5CA&ved=0CA4QpwUoAQ&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=ceb140a66a4b1305&biw=1422&bih=783";
  equal(urlManager.getGoogleQuery(url), "jquery", "直近1時間検索");
  start();
});
