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

// ---------- Display ----------

// ---------- Events ----------
