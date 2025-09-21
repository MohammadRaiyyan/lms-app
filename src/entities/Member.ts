import { MemberLimitExceededError } from "../errors/MemberLimitExceededError";
import { Book } from "./Book";

/**
 * Represents a borrowed book record with its borrow date
 */
export type BorrowedBook = {
  /** The book that was borrowed */
  book: Book;
  /** The date when the book was borrowed */
  borrowedDate: Date;
};

/** Possible member types */
export type MemberType = "Regular" | "Premium";

/**
 * Member
 *
 * Represents a library member with basic properties, member type,
 * and a list of borrowed books.
 */
export class Member {
  /** Unique identifier for the member */
  public readonly id: number;

  /** Name of the member */
  public readonly name: string;

  /** Member type, affects fine calculation and privileges */
  public readonly memberType: MemberType;

  /** Internal storage of borrowed books */
  private _borrowedBooks: BorrowedBook[];

  /** Maximum books allowed based on member type */
  private _maxBooksAllowed: number = 4;

  /**
   * Creates a new Member instance
   * @param id Unique identifier
   * @param name Name of the member
   * @param memberType Type of the member (default: "Regular")
   */
  constructor(
    id: number,
    name: string,
    memberType: MemberType = "Regular",
    maxBooksAllowed: number = 4,
  ) {
    this.id = id;
    this.name = name;
    this._borrowedBooks = [];
    this.memberType = memberType;
    this._maxBooksAllowed = maxBooksAllowed;
  }

  /**
   * Returns a read-only array of borrowed books
   */
  get borrowedBooks(): ReadonlyArray<BorrowedBook> {
    return this._borrowedBooks;
  }

  /** Set Maximum allowed books to borrow */
  set maxBooksAllowed(value: number) {
    this._maxBooksAllowed = value;
  }
  /** Get Maximum allowed books to borrow */
  get maxBooksAllowed(): number {
    return this._maxBooksAllowed;
  }

  /**
   * Borrows a book if it is available
   * Updates the book's availability and records the borrow date
   * @param book Book instance to borrow
   */
  borrowBook(book: Book): void {
    if (this._borrowedBooks.length >= this._maxBooksAllowed) {
      throw new MemberLimitExceededError(this.id);
    }
    if (book.isAvailable) {
      book.markAsBorrowed();
      this._borrowedBooks.push({ book, borrowedDate: new Date() });
    }
  }

  /**
   * Returns a borrowed book
   * Updates the book's availability and removes it from borrowed list
   * @param book Book instance to return
   */
  returnBook(book: Book): void {
    this._borrowedBooks = this._borrowedBooks.filter((b: BorrowedBook) => b.book.id !== book.id);
    book.markAsReturned();
  }
}
