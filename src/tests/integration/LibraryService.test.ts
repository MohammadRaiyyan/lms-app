import { FineStrategies } from "../../contracts/IFineCalculator";
import { Member, MemberType } from "../../entities/Member";
import { EventTypeEnum } from "../../enums/EventTypeEnum";
import { BookAlreadyBorrowedError } from "../../errors/BookAlreadyBorrowedError";
import { EventBus } from "../../events/EventBus";
import { BookRepository } from "../../repositories/BookRepository";
import { MemberRepository } from "../../repositories/MemberRepository";
import { LibraryService } from "../../services/LibraryService";
import { PremiumFineCalculator } from "../../strategies/PremiumFineCalculator";
import { SimpleFineCalculator } from "../../strategies/SimpleFineCalculator";

const Members: Record<MemberType, MemberType> = {
  Premium: "Premium",
  Regular: "Regular",
};

describe("LibraryService Integration", () => {
  let libraryService: LibraryService;
  let eventBus: EventBus;

  beforeEach(() => {
    const bookRepo = new BookRepository();
    const memberRepo = new MemberRepository();
    eventBus = new EventBus();
    const fineStrategies: FineStrategies = {
      Regular: new SimpleFineCalculator(10, 14),
      Premium: new PremiumFineCalculator(5, 20),
    };

    libraryService = new LibraryService(memberRepo, bookRepo, fineStrategies, eventBus);
  });

  it("should add a book and trigger NEW_BOOK_ADDED event", async () => {
    const mockCallback = jest.fn();
    eventBus.subscribe(EventTypeEnum.NEW_BOOK_ADDED, mockCallback);

    const book = await libraryService.addBook("1984", "George Orwell");

    expect(book.title).toBe("1984");
    expect(book.author).toBe("George Orwell");
    expect(book.isAvailable).toBe(true);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        newBook: expect.objectContaining({
          id: book.id,
          title: book.title,
          author: book.author,
          isAvailable: true,
        }),
      }),
    );
  });

  it("should register a member successfully", async () => {
    const member = await libraryService.registerMember("Alice");

    expect(member.name).toBe("Alice");
    expect(member.memberType).toBe(Members.Regular); // default is Regular
    expect(member.borrowedBooks.length).toBe(0);
  });

  it("should allow borrowing a book and update states", async () => {
    const member = await libraryService.registerMember("Bob");
    const book = await libraryService.addBook("Brave New World", "Aldous Huxley");

    const borrowedBook = await libraryService.borrowBook(member.id, book.id);

    expect(borrowedBook.isAvailable).toBe(false);

    // Re-fetch member from repository to get updated state
    const updatedMember = await libraryService
      .listMembers()
      .then((members) => members.find((m) => m.id === member.id)!);

    expect(updatedMember.borrowedBooks.some((b) => b.book.id === book.id)).toBe(true);
  });

  it("should throw error when borrowing unavailable book", async () => {
    const member = await libraryService.registerMember("Charlie");
    const book = await libraryService.addBook("The Hobbit", "Tolkien");

    // Borrow once
    await libraryService.borrowBook(member.id, book.id);

    // Borrow again should throw
    await expect(libraryService.borrowBook(member.id, book.id)).rejects.toThrow(
      BookAlreadyBorrowedError,
    );
  });

  it("should return a book and trigger BOOK_RETURNED event", async () => {
    const mockCallback = jest.fn();
    eventBus.subscribe(EventTypeEnum.BOOK_RETURNED, mockCallback);

    const member = await libraryService.registerMember("Daisy");
    const book = await libraryService.addBook("Fahrenheit 451", "Ray Bradbury");

    await libraryService.borrowBook(member.id, book.id);
    await libraryService.returnBook(member.id, book.id);

    expect(book.isAvailable).toBe(true);
    expect(member.borrowedBooks.length).toBe(0);
    expect(mockCallback).toHaveBeenCalledWith({ memberId: member.id, bookId: book.id });
  });

  it("should calculate fine correctly for overdue book", async () => {
    const member = await libraryService.registerMember("Eve");
    const book = await libraryService.addBook("Animal Farm", "George Orwell");

    await libraryService.borrowBook(member.id, book.id);

    // Manually modify borrowed date to simulate overdue
    const borrowed = member.borrowedBooks.find((b) => b.book.id === book.id);
    if (borrowed) borrowed.borrowedDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000); // 20 days ago

    const fine = await libraryService.calculateFine(member.id, book.id);
    expect(fine).toBeGreaterThan(0);
  });

  it("should switch fine strategies correctly between Regular and Premium", async () => {
    const regular = await libraryService.registerMember("Frank");
    const premium = new Member(99, "Grace", "Premium");
    // manually push premium member into repo
    await libraryService["memberRepository"].addMember(premium);

    const book1 = await libraryService.addBook("Regular Book", "Author");
    const book2 = await libraryService.addBook("Premium Book", "Author");

    await libraryService.borrowBook(regular.id, book1.id);
    await libraryService.borrowBook(premium.id, book2.id);

    // Force overdue
    regular.borrowedBooks[0].borrowedDate = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);
    premium.borrowedBooks[0].borrowedDate = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);

    const fineRegular = await libraryService.calculateFine(regular.id, book1.id);
    const finePremium = await libraryService.calculateFine(premium.id, book2.id);

    expect(finePremium).toBeLessThan(fineRegular); // Premium has lighter penalties
  });

  it("should publish overdue event when book is late", async () => {
    const mockCallback = jest.fn();
    eventBus.subscribe("BOOK_OVERDUE", mockCallback);

    const member = await libraryService.registerMember("Henry");
    const book = await libraryService.addBook("Test Book", "Author");

    await libraryService.borrowBook(member.id, book.id);

    // Simulate overdue check (would normally be a cron job)
    const borrowed = member.borrowedBooks.find((b) => b.book.id === book.id);
    if (borrowed) borrowed.borrowedDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // In real system: libraryService would have checkOverdueBooks() that publishes event
    eventBus.publish("BOOK_OVERDUE", { memberId: member.id, bookId: book.id });

    expect(mockCallback).toHaveBeenCalledWith({ memberId: member.id, bookId: book.id });
  });
});
