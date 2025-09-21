import { Book } from "../entities/Book";
import { Member, MemberType } from "../entities/Member";

/**
 * ILibraryService
 *
 * Interface representing the core library service.
 * Provides methods to manage books, members, borrowing/returning,
 * and fine calculations.
 */
export interface ILibraryService {
  /**
   * Registers a new library member.
   * @param name Name of the member
   * @returns Promise that resolves to the newly created Member instance
   */
  registerMember(name: string, memberType?: MemberType, maxBooksAllowed?: number): Promise<Member>;

  /**
   * Unregisters (removes) a library member by ID.
   * @param id ID of the member to remove
   * @returns Promise that resolves once the member is deleted
   */
  unregisterMember(id: number): Promise<void>;

  /**
   * Adds a new book to the library.
   * @param title Title of the book
   * @param author Author of the book
   * @returns Promise that resolves to the newly added Book instance
   */
  addBook(title: string, author: string): Promise<Book>;

  /**
   * Removes a book from the library by ID.
   * @param id ID of the book to remove
   * @returns Promise that resolves once the book is deleted
   */
  removeBook(id: number): Promise<void>;

  /**
   * Allows a member to borrow a book by IDs.
   * Throws an error if the book is not available or member cannot borrow.
   * @param memberId ID of the member borrowing the book
   * @param bookId ID of the book to borrow
   * @returns Promise that resolves to the borrowed Book instance
   */
  borrowBook(memberId: number, bookId: number): Promise<Book>;

  /**
   * Allows a member to return a borrowed book.
   * Throws an error if the book was not borrowed by the member.
   * @param memberId ID of the member returning the book
   * @param bookId ID of the book being returned
   * @returns Promise that resolves once the book is returned
   */
  returnBook(memberId: number, bookId: number): Promise<void>;

  /**
   * Lists all books that are currently available to borrow.
   * @returns Promise that resolves to a readonly array of available books
   */
  listAvailableBooks(): Promise<ReadonlyArray<Book>>;

  /**
   * Lists all registered library members.
   * @returns Promise that resolves to a readonly array of members
   */
  listMembers(): Promise<ReadonlyArray<Member>>;

  /**
   * Calculates the fine for a member for a specific book.
   * @param memberId ID of the member
   * @param bookId ID of the book
   * @returns Promise that resolves to the calculated fine amount
   */
  calculateFine(memberId: number, bookId: number): Promise<number>;
}
