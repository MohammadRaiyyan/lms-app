import { BookAlreadyReturnedError } from "../errors/BookAlreadyReturnedError";

/**
 * Book
 *
 * Represents a library book entity with basic properties and state management.
 * Encapsulates availability state and provides methods to borrow and return the book.
 */
export class Book {
  /** Unique identifier for the book */
  public readonly id: number;

  /** Title of the book */
  public readonly title: string;

  /** Author of the book */
  public readonly author: string;

  /** Internal availability state */
  private _isAvailable: boolean;

  /**
   * Creates a new Book instance
   * @param id Unique identifier
   * @param title Title of the book
   * @param author Author of the book
   * @param isAvailable Optional initial availability (default: true)
   */
  constructor(id: number, title: string, author: string, isAvailable: boolean = true) {
    this.id = id;
    this.title = title;
    this.author = author;
    this._isAvailable = isAvailable;
  }

  /**
   * Marks the book as borrowed
   * Sets the internal availability state to false
   */
  markAsBorrowed(): void {
    if (!this._isAvailable) {
      throw new Error(`Book '${this.id}' is already borrowed.`);
    }
    this._isAvailable = false;
  }

  /**
   * Marks the book as returned
   * Sets the internal availability state to true
   */
  markAsReturned(): void {
    if (this._isAvailable) {
      throw new BookAlreadyReturnedError(this.id);
    }
    this._isAvailable = true;
  }

  /**
   * Checks if the book is currently available to borrow
   * @returns true if available, false otherwise
   */
  get isAvailable(): boolean {
    return this._isAvailable;
  }
}
