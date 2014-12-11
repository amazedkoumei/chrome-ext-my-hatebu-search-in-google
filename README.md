chrome-ext-my-hatebu-search-in-google
======================

[![Build Status](https://travis-ci.org/amazedkoumei/chrome-ext-my-hatebu-search-in-google.svg?branch=master)](https://travis-ci.org/amazedkoumei/chrome-ext-my-hatebu-search-in-google)

概要 / Overview
----------
マイブックマークをアイコンから参照でるようにするChrome Extensionです。

Google検索結果画面では現在の検索ワードに一致するブックマーク件数がバッジ表示され、アイコンをクリックすると絞り込まれた状態でマイブックマークが表示されます。

インストール / Install
----------
Chrome Web Storeで公開しています。

https://chrome.google.com/webstore/detail/fagdddhhkjdpchaokeceilckcefmbeil

デバッグを行う際にはchromeの設定->拡張機能で右上の「デベロッパーモード」チェックボックスをONにしたうえで
 「パッケージ化されていないされていない拡張を読み込む」ボタンでこのパッケージを読み込んでください。

 上記の画面には下記URLからもアクセスできます。

chrome://settings/extensions

Pull Request / Pull Request
----------

テストにはqunit( http://docs.jquery.com/QUnit )を使用しています。ダウンロードしたパッケージをWebサーバのDocumentRootに配置し、chrome-ext-my-hatebu-search-in-google/test/ にアクセスすることでテストを実施できます。

### ブラウザを利用してのテスト

テストの追加・修正 が必要な場合は、test/test.jsを修正のうえ、Pull Requestに含めてください。

### Grunt を利用してのテスト

    $ cd chrome-ext-ato-ichinen
    $ npm install -g grunt-cli (既に install 済みの場合は不要)
    $ npm install -g bower (既に install 済みの場合は不要)
    $ npm install
    $ grunt init
    $ grunt test

ライセンス / License
----------
Copyright &copy; 2012 amazedkoumei
Licensed under the [MIT License][mit]
 
[MIT]: http://www.opensource.org/licenses/mit-license.php
