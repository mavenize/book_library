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

const libraryContainer = document.querySelector("#library");

// Builds the card element for a single book. Reads data only; never mutates it.
function createBookCard(book) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = book.id; // links this element to its Book object

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "card-meta";
  author.textContent = `by ${book.author}`;

  const pages = document.createElement("p");
  pages.className = "card-meta";
  pages.textContent = `${book.pages} pages`;

  const status = document.createElement("p");
  status.className = `card-status ${book.read ? "is-read" : "is-unread"}`;
  status.textContent = book.read ? "Read" : "Not read yet";

  card.append(title, author, pages, status);
  return card;
}

// Re-renders the whole library from myLibrary.
function displayBooks() {
  libraryContainer.replaceChildren(...myLibrary.map(createBookCard));
}

displayBooks();

// ---------- Events ----------
