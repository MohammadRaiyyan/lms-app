import { IBookRepository } from "../contracts/IBookRepository";
import { Book } from "../entities/Book";

/**
 * BookRepository
 *
 * In-memory implementation of the IBookRepository.
 * Provides CRUD operations for managing books in the library.
 */
export class BookRepository implements IBookRepository {
  /** Internal storage for books */
  private books: Book[] = [];

  /**
   * Adds a book to the repository
   * @param book Book instance to add
   * @returns The same book that was added
   */
  async addBook(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  /**
   * Deletes a book from the repository by its ID
   * @param id ID of the book to delete
   */
  async deleteBook(id: number): Promise<void> {
    this.books = this.books.filter((book) => book.id !== id);
  }

  /**
   * Finds a book by its ID
   * @param id ID of the book to find
   * @returns The Book instance if found, otherwise undefined
   */
  async findById(id: number): Promise<Book | undefined> {
    return this.books.find((book) => book.id === id);
  }

  /**
   * Lists all books in the repository
   * @returns Readonly array of all books
   */
  async list(): Promise<ReadonlyArray<Book>> {
    return this.books;
  }
}
