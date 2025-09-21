import { Book } from "../../../entities/Book";
import { BookRepository } from "../../../repositories/BookRepository";

describe("BookRepository", () => {
  it("should add and retrieve a book by ID", () => {
    const repo = new BookRepository();
    const book = new Book(1, "Test Book", "Author");
    repo.addBook(book);
    repo.findById(1).then((found) => {
      expect(found).toBe(book);
    });
  });

  it("should delete a book by ID", () => {
    const repo = new BookRepository();
    const book = new Book(1, "Test Book", "Author");
    repo.addBook(book).then(() => {
      repo.deleteBook(1).then(() => {
        repo.findById(1).then((found) => {
          expect(found).toBeUndefined();
        });
      });
    });
  });

  it("should return all books", () => {
    const repo = new BookRepository();
    const book1 = new Book(1, "Test Book 1", "Author 1");
    const book2 = new Book(2, "Test Book 2", "Author 2");
    Promise.all([repo.addBook(book1), repo.addBook(book2)]).then(() => {
      repo.list().then((books) => {
        expect(books.length).toBe(2);
        expect(books).toContain(book1);
        expect(books).toContain(book2);
      });
    });
  });

  it("should throw if book does not exist", () => {
    const repo = new BookRepository();
    repo.findById(999).then((found) => {
      expect(found).toBeUndefined();
    });
  });
});
