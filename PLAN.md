# Book Library — Plan Proposal

## Goal
This is a small browser app for keeping a personal library of books. You can add a book (title, author, pages, read status), see every book as a card, remove a book, and mark a book as read or unread.

It uses plain HTML, CSS, and JavaScript, with no frameworks and no build step. To run it, open `index.html` in a browser.

## File structure
```
book_library/
├── index.html   # page skeleton: header, library container, dialog form
├── styles.css   # layout, card grid, dialog and button styles
├── script.js    # data, display, and event logic
└── PLAN.md      # this document
```

## Architecture: keep data and display separate
The book data is the single source of truth. The page is always redrawn from that data and is never edited by hand.

### 1. Data layer
```js
const myLibrary = [];

function Book(title, author, pages, read) {
  if (!new.target) throw Error("Use 'new' to call Book");
  this.id = crypto.randomUUID(); // unique, stable id
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
}

function removeBookFromLibrary(id) {
  const index = myLibrary.findIndex((book) => book.id === id);
  if (index !== -1) myLibrary.splice(index, 1);
}
```

### 2. Display layer
`displayBooks()` empties `#library`, then loops through `myLibrary` and builds one card per book. Each card holds the title, author, pages, read status, a **Remove** button, and a **Toggle read** button. Each card also carries `data-id="<book.id>"`, which links the DOM element back to its book object.

### 3. Event layer
- The **New Book** button opens a `<dialog>` with `showModal()`.
- On form `submit`, the handler calls `event.preventDefault()` so the form doesn't try to send data to a server. It then reads the inputs, calls `addBookToLibrary(...)`, calls `displayBooks()`, and resets and closes the form.
- One click listener on `#library` handles every card button. It reads the closest card's `data-id`, then either removes the book or calls `book.toggleRead()`, and finally calls `displayBooks()`.

**Rule:** a handler changes `myLibrary` first and then calls `displayBooks()`. It never patches the DOM directly.

## Milestones
These match the tasks in `.todo4vcode/shared-tasks.json`.

| # | Milestone | Priority |
|---|---|---|
| 1 | Basic HTML/CSS structure | Must |
| 2 | Book constructor + library array | Must |
| 3 | `addBookToLibrary()` + sample books | Must |
| 4 | Render books as cards (`displayBooks`) | Must |
| 5 | "New Book" dialog form | Must |
| 6 | Handle form submit (`preventDefault`) | Must |
| 7 | Remove book button | Must |
| 8 | Toggle read status (`Book.prototype.toggleRead`) | Must |
| 9 | Styling polish + manual QA | Should |
| 10 | Persist the library in localStorage | Could |

## Out of scope for now
- Editing an existing book
- Sorting and filtering
- A backend or accounts
