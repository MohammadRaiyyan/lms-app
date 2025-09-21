import { Book } from "../../../entities/Book";
import { BookAlreadyReturnedError } from "../../../errors/BookAlreadyReturnedError";

describe("Book Entity", () => {
  it("should be available when created", () => {
    const book = new Book(1, "Test Book", "Author");
    expect(book.isAvailable).toBe(true);
  });

  it("should mark as borrowed", () => {
    const book = new Book(1, "Test Book", "Author");
    book.markAsBorrowed();
    expect(book.isAvailable).toBe(false);
  });

  it("should mark as returned", () => {
    const book = new Book(1, "Test Book", "Author");
    book.markAsBorrowed();
    book.markAsReturned();
    expect(book.isAvailable).toBe(true);
  });

  it("should throw error when borrowing an unavailable book", () => {
    const book = new Book(1, "Test Book", "Author");
    book.markAsBorrowed();
    expect(() => book.markAsBorrowed()).toThrow("Book '1' is already borrowed.");
  });

  it("should throw error when returning an available book", () => {
    const book = new Book(1, "Test Book", "Author");
    expect(() => book.markAsReturned()).toThrow(new BookAlreadyReturnedError(book.id));
  });
});
