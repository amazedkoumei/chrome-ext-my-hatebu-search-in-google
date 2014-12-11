var Database = Deferred.WebDatabase;
var Model = Database.Model, SQL = Database.SQL;
var db = new Database("google-hatena");
var Bookmark;

Bookmark = Model({
    table: 'bookmark',
    primaryKeys: ['id'],
    fields: {
        'id'    : 'INTEGER PRIMARY KEY',
        url     : 'TEXT UNIQUE NOT NULL',
        title   : 'TEXT',
        comment : 'TEXT',
    }
}, db);
