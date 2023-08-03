const db = require('./db');

//API to Add a book to the database
const addBook = (book) => {
  const { id, title, authors, description, canonicalVolumeLink } = book;

  db.run(
    'INSERT INTO books (id, title, author, description, link) VALUES (?, ?, ?, ?, ?)',
    [id, title, authors.join(', '), description, canonicalVolumeLink],
    (err) => {
      if (err) {
        console.error('Error while adding the book:', err.message);
      } else {
        console.log('Book added successfully!');
      }
    }
  );
};

// API to Retrieve all books from the database
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM books', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  addBook,
  getAllBooks,
};
