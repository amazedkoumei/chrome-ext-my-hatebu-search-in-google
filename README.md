chrome-ext-my-hatebu-search-in-google
======================

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
まずはIssueを確認し、適切なIssueが見当たらない場合は登録してください。

devlopブランチからIssue#[Issue番号]という名前でブランチを切り、Pull Requestしてください。

ブランチ名の例) issue#1

テストにはqunit( http://docs.jquery.com/QUnit )を使用しています。ダウンロードしたパッケージをWebサーバのDocumentRootに配置し、chrome-ext-my-hatebu-search-in-google/test/ にアクセスすることでテストを実施できます。

テストの追加・修正 が必要な場合は、test/test.jsを修正のうえ、Pull Requestに含めてください。

ライセンス / License
----------
Copyright &copy; 2012 amazedkoumei
Licensed under the [MIT License][mit]
 
[MIT]: http://www.opensource.org/licenses/mit-license.php
