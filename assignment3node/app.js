const axios = require('axios');
const inquirer = require('inquirer');
const { addBook, getAllBooks } = require('./queries');

const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const searchBooks = async (query) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_API_BASE_URL, {
      params: {
        q: query,
        maxResults: 5,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error while searching for books:', error.message);
    return [];
  }
};

const displayBooks = (books) => {
  console.log('Search Results are:');
  books.forEach((book) => {
    console.log(`- ${book.volumeInfo.title} by ${book.volumeInfo.authors.join(', ')}`);
    console.log(`  Description: ${book.volumeInfo.description}`);
    console.log(`  Link: ${book.volumeInfo.canonicalVolumeLink}`);
    console.log('_________________________________');
  });
};

const mainfunc = async () => {
  const { searchQuery } = await inquirer.prompt([
    {
      name: 'searchQuery',
      message: 'Enter a book title or author you want to search:',
    },
  ]);

  const searchResults = await searchBooks(searchQuery);
  displayBooks(searchResults);

  const { favoriteBookIndex } = await inquirer.prompt([
    {
      name: 'favoriteBookIndex',
      message: 'Enter the index of the book you want to save as a favorite:',
      type: 'number',
      validate: (input) => input >= 1 && input <= searchResults.length,
    },
  ]);

  const selectedBook = searchResults[favoriteBookIndex - 1];
  addBook(selectedBook.volumeInfo);

  const favorites = await getAllBooks();
  console.log('Your favorite books are:');
  favorites.forEach((favorite) => {
    console.log(`- ${favorite.title} by ${favorite.author}`);
  });
};

mainfunc();
