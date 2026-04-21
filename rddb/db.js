const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'rd.sqlite'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    reddit_id   TEXT    NOT NULL UNIQUE,
    title       TEXT    NOT NULL,
    subreddit   TEXT    NOT NULL,
    url         TEXT,
    score       INTEGER DEFAULT 0,
    saved_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS votes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    reddit_id   TEXT    NOT NULL,
    direction   INTEGER NOT NULL CHECK (direction IN (-1, 1)),
    voted_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (reddit_id) REFERENCES posts (reddit_id) ON DELETE CASCADE
  );
`);

module.exports = db;
