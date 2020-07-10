const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('db/strsft.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('[Database] Connected');
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS users (username varchar(255), discordID varchar(255),  administrator boolean, verified boolean)")
      db.run("CREATE TABLE IF NOT EXISTS projects (name varchar(255), description varchar(255), link boolean)")
      db.run("CREATE TABLE IF NOT EXISTS flutecoin (discordID varchar(255), amount varchar(255))")
    })
});

module.exports = db;