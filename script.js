// Book Library
// The code is split into three sections:
//   1. Data:    myLibrary array, Book constructor, addBookToLibrary (Tasks 2-3)
//   2. Display: displayBooks() renders cards from myLibrary (Task 4)
//   3. Events:  New Book dialog, form submit, remove and toggle (Tasks 5-8)

// ---------- Data ----------

// All books live here. The page is always rendered from this array.
const myLibrary = [];

function Book(title, author, pages, read) {
  if (!new.target) {
    throw new Error("Book must be called with 'new'");
  }
  this.id = crypto.randomUUID(); // unique, stable identifier
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Creates a Book from the given details and stores it in myLibrary.
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}

// Sample books so there is something to display during development.
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);
addBookToLibrary("Dune", "Frank Herbert", 412, false);
addBookToLibrary("1984", "George Orwell", 328, true);
addBookToLibrary("Eloquent JavaScript", "Marijn Haverbeke", 472, false);

// ---------- Display ----------

// ---------- Events ----------
