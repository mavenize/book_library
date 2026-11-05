# Book Library

A small browser app for keeping track of the books you own and have read. It is built with plain HTML, CSS, and JavaScript, with no frameworks and no build step.

## Features

- Add a book with its title, author, page count, and read status in a dialog form
- See every book as a card, colour-coded by read status
- Mark a book as read or unread
- Remove a book
- The library is saved in your browser (`localStorage`), so it is still there after a reload

## Running it

Open `index.html` in any modern browser. No install or server is needed.

The first visit shows four sample books. Remove them to start your own library. To get the samples back, delete the `book-library` key from your browser's localStorage (DevTools → Application → Local Storage).

## Project structure

```
book_library/
├── index.html   # page skeleton: header, library container, New Book dialog
├── styles.css   # theme, card grid, buttons, dialog and form styles
├── script.js    # data, storage, display, and event logic
└── PLAN.md      # original plan and milestones
```

## How it works

`script.js` keeps the data separate from the page:

- **Data:** `myLibrary` is an array of `Book` objects. Each `Book` has a unique `id` from `crypto.randomUUID()`, and `Book.prototype.toggleRead()` flips its read status.
- **Storage:** `saveLibrary()` writes the array to localStorage after every change. `loadLibrary()` rebuilds real `Book` instances on startup, so their methods still work.
- **Display:** `displayBooks()` redraws every card from `myLibrary`. Each card has a `data-id` that links it to its book.
- **Events:** the form's submit handler and a single delegated click listener on the library update `myLibrary` first, then save and call `displayBooks()`. They never edit the page directly.

See [PLAN.md](PLAN.md) for the full design.
