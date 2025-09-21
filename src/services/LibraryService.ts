import { IBookRepository } from "../contracts/IBookRepository";
import { IEventBus } from "../contracts/IEventBus";
import { FineStrategies } from "../contracts/IFineCalculator";
import { ILibraryService } from "../contracts/ILibraryService";
import { IMemberRepository } from "../contracts/IMemberRepository";
import { Book } from "../entities/Book";
import { Member, MemberType } from "../entities/Member";
import { EventTypeEnum } from "../enums/EventTypeEnum";
import { BookAlreadyBorrowedError } from "../errors/BookAlreadyBorrowedError";
import { BookAlreadyReturnedError } from "../errors/BookAlreadyReturnedError";
import { BookNotAvailableError } from "../errors/BookNotAvailableError";
import { MemberNotFoundError } from "../errors/MemberNotFoundError";

/**
 * LibraryService
 *
 * This service is the core business layer for the LMS system.
 * It manages books, members, borrowing/returning, fines, and publishes domain events.
 */
export class LibraryService implements ILibraryService {
  private memberRepository: IMemberRepository;
  private bookRepository: IBookRepository;
  private fineStrategies: FineStrategies;
  private eventBus: IEventBus;

  private lastId = 0;
  private lastMemberId = 0;

  /**
   * LibraryService constructor
   * @param memberRepository Repository for managing members
   * @param bookRepository Repository for managing books
   * @param fineStrategies Mapping of member type to fine calculator strategy
   * @param eventBus Event bus to publish domain events (Observer pattern)
   */
  constructor(
    memberRepository: IMemberRepository,
    bookRepository: IBookRepository,
    fineStrategies: FineStrategies,
    eventBus: IEventBus,
  ) {
    this.memberRepository = memberRepository;
    this.bookRepository = bookRepository;
    this.fineStrategies = fineStrategies;
    this.eventBus = eventBus;
  }

  /**
   * Adds a new book to the repository and publishes a NEW_BOOK_ADDED event
   * @param title Title of the book
   * @param author Author of the book
   * @returns The created Book instance
   */
  async addBook(title: string, author: string): Promise<Book> {
    const newBook: Book = new Book(this.lastId++, title, author);
    this.eventBus.publish(EventTypeEnum.NEW_BOOK_ADDED, { newBook });
    return this.bookRepository.addBook(newBook);
  }

  /**
   * Borrows a book for a member
   * Throws errors if:
   *  - Member not found
   *  - Member has reached max borrowed books
   *  - Book is not available or already borrowed by the member
   * @param memberId ID of the member
   * @param bookId ID of the book to borrow
   * @returns The borrowed Book instance
   */
  async borrowBook(memberId: number, bookId: number): Promise<Book> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    if (member.borrowedBooks.some((b) => b.book.id === bookId)) {
      throw new BookAlreadyBorrowedError(bookId);
    }
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotAvailableError(bookId);
    }
    if (!book.isAvailable) {
      throw new BookAlreadyBorrowedError(bookId);
    }
    member.borrowBook(book);
    return book;
  }

  /**
   * Lists all books that are currently available to borrow
   * @returns Readonly array of available Book instances
   */
  async listAvailableBooks(): Promise<ReadonlyArray<Book>> {
    const allBooks = await this.bookRepository.list();
    return allBooks.filter((book) => book.isAvailable);
  }

  /**
   * Removes a book from the repository by ID
   * @param id Book ID
   */
  async removeBook(id: number): Promise<void> {
    await this.bookRepository.deleteBook(id);
  }

  /**
   * Returns a borrowed book from a member and publishes a BOOK_RETURNED event
   * Throws errors if:
   *  - Member not found
   *  - Book not found
   *  - Book was not borrowed
   * @param memberId Member returning the book
   * @param bookId Book being returned
   */
  async returnBook(memberId: number, bookId: number): Promise<void> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotAvailableError(bookId);
    }
    if (book.isAvailable) {
      throw new BookAlreadyReturnedError(bookId);
    }
    member.returnBook(book);
    this.eventBus.publish(EventTypeEnum.BOOK_RETURNED, { memberId, bookId });
  }

  /**
   * Registers a new member in the library
   * @param name Name of the member
   * @returns The created Member instance
   */
  async registerMember(
    name: string,
    memberType?: MemberType,
    maxBooksAllowed?: number,
  ): Promise<Member> {
    const newMember: Member = new Member(this.lastMemberId++, name, memberType, maxBooksAllowed);

    return this.memberRepository.addMember(newMember);
  }

  /**
   * Unregisters a member from the library
   * @param id Member ID
   */
  async unregisterMember(id: number): Promise<void> {
    await this.memberRepository.deleteMember(id);
  }

  /**
   * Lists all registered members
   * @returns Readonly array of Member instances
   */
  async listMembers(): Promise<ReadonlyArray<Member>> {
    return this.memberRepository.list();
  }

  /**
   * Calculates the overdue fine for a borrowed book based on member type and fine strategy
   * Throws errors if:
   *  - Member not found
   *  - Book was not borrowed by this member
   * @param memberId ID of the member
   * @param bookId ID of the borrowed book
   * @returns Fine amount in currency units (number)
   */
  async calculateFine(memberId: number, bookId: number): Promise<number> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    const borrowedBook = member.borrowedBooks.find((b) => b.book.id === bookId);
    if (!borrowedBook) {
      throw new BookAlreadyReturnedError(bookId);
    }
    const borrowedDate = borrowedBook.borrowedDate;
    const now = new Date();
    const daysLate = Math.max(
      0,
      Math.floor((now.getTime() - borrowedDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const fineCalculator = this.fineStrategies[member.memberType];
    return fineCalculator.calculateFine(daysLate);
  }
}
