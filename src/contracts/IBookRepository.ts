import { Book } from "../entities/Book";

/**
 * IBookRepository
 *
 * Interface representing a repository for managing Book entities.
 * Provides methods for basic CRUD operations.
 */
export interface IBookRepository {
  /**
   * Adds a book to the repository.
   * @param book Book instance to add
   * @returns Promise that resolves to the added book
   */
  addBook(book: Book): Promise<Book>;

  /**
   * Deletes a book from the repository by its ID.
   * @param id ID of the book to delete
   * @returns Promise that resolves once the book is deleted
   */
  deleteBook(id: number): Promise<void>;

  /**
   * Finds a book by its ID.
   * @param id ID of the book to find
   * @returns Promise that resolves to the Book instance if found, otherwise undefined
   */
  findById(id: number): Promise<Book | undefined>;

  /**
   * Lists all books in the repository.
   * @returns Promise that resolves to a readonly array of all books
   */
  list(): Promise<ReadonlyArray<Book>>;
}
