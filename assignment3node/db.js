const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('books.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database.');
    // Create the books table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        description TEXT,
        link TEXT
      );
    `);
  }
});

module.exports = db;
