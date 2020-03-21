const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/strsft.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('[Database] Connected');
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS users (username varchar(255), discordID varchar(255),  administrator boolean, verified boolean)")
    })
});

module.exports = db;