// Book Library
// The code is split into four sections:
//   1. Data:    myLibrary array, Book constructor, add / remove (Tasks 2-3, 7-8)
//   2. Storage: save / load myLibrary in localStorage (Task 10)
//   3. Display: displayBooks() renders cards from myLibrary (Task 4)
//   4. Events:  New Book dialog, form submit, remove and toggle (Tasks 5-8)

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

// Shared by every Book through the prototype, not copied onto each instance.
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Creates a Book from the given details and stores it in myLibrary.
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}

// Removes the book with the given id from myLibrary (no-op if not found).
function removeBookFromLibrary(id) {
  const index = myLibrary.findIndex((book) => book.id === id);
  if (index !== -1) myLibrary.splice(index, 1);
}

// ---------- Storage ----------

const STORAGE_KEY = "book-library";

// Writes myLibrary to localStorage. JSON keeps only the own data fields.
function saveLibrary() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myLibrary));
  } catch {
    // Storage can be full or blocked (e.g. private mode); the app still works.
  }
}

// Fills myLibrary from localStorage. Returns false if nothing usable was saved.
function loadLibrary() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
  if (!Array.isArray(saved)) return false;

  for (const data of saved) {
    // Rebuild a real Book so it gets toggleRead from the prototype,
    // then keep the saved id so it stays stable across reloads.
    const book = addBookToLibrary(data.title, data.author, data.pages, data.read);
    book.id = data.id;
  }
  return true;
}

// Seed sample books on the very first visit only.
if (!loadLibrary()) {
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);
  addBookToLibrary("Dune", "Frank Herbert", 412, false);
  addBookToLibrary("1984", "George Orwell", 328, true);
  addBookToLibrary("Eloquent JavaScript", "Marijn Haverbeke", 472, false);
  saveLibrary();
}

// ---------- Display ----------

const libraryContainer = document.querySelector("#library");

// Builds the card element for a single book. Reads data only; never mutates it.
function createBookCard(book) {
  const card = document.createElement("article");
  card.className = `card ${book.read ? "is-read" : "is-unread"}`;
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

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "btn btn-secondary";
  toggleButton.dataset.action = "toggle-read";
  toggleButton.textContent = book.read ? "Mark unread" : "Mark read";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn btn-danger";
  removeButton.dataset.action = "remove";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", `Remove ${book.title}`);

  actions.append(toggleButton, removeButton);

  card.append(title, author, pages, status, actions);
  return card;
}

// Shown in place of the cards when the library is empty.
function createEmptyState() {
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "Your library is empty. Click “+ New Book” to add one.";
  return message;
}

// Re-renders the whole library from myLibrary.
function displayBooks() {
  if (myLibrary.length === 0) {
    libraryContainer.replaceChildren(createEmptyState());
    return;
  }
  libraryContainer.replaceChildren(...myLibrary.map(createBookCard));
}

displayBooks();

// ---------- Events ----------

const newBookButton = document.querySelector("#new-book-btn");
const bookDialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");
const cancelButton = document.querySelector("#cancel-btn");

newBookButton.addEventListener("click", () => {
  bookDialog.showModal();
});

cancelButton.addEventListener("click", () => {
  bookDialog.close();
});

// Runs however the dialog closes (Cancel, submit, or the Escape key).
bookDialog.addEventListener("close", () => {
  bookForm.reset();
});

bookForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser from sending the form to a server

  const formData = new FormData(bookForm);
  const title = formData.get("title").trim();
  const author = formData.get("author").trim();

  // `required` accepts whitespace-only input, so check the trimmed values too.
  const titleInput = bookForm.elements.title;
  const authorInput = bookForm.elements.author;
  titleInput.setCustomValidity(title ? "" : "Please enter a title.");
  authorInput.setCustomValidity(author ? "" : "Please enter an author.");
  if (!bookForm.reportValidity()) return;

  addBookToLibrary(title, author, Number(formData.get("pages")), formData.get("read") === "on");

  saveLibrary();
  displayBooks();
  bookDialog.close();
});

// Clear a custom error as soon as the user edits the field again.
bookForm.addEventListener("input", (event) => {
  event.target.setCustomValidity("");
});

// One listener handles the buttons on every card (event delegation).
libraryContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { id } = button.closest(".card").dataset;

  if (button.dataset.action === "remove") {
    removeBookFromLibrary(id);
  } else if (button.dataset.action === "toggle-read") {
    const book = myLibrary.find((b) => b.id === id);
    if (book) book.toggleRead();
  }

  saveLibrary();
  displayBooks();
});
