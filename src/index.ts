import { FineStrategies } from "./contracts/IFineCalculator";
import { Book } from "./entities/Book";
import { EventTypeEnum } from "./enums/EventTypeEnum";
import { EventBus } from "./events/EventBus";
import { BookRepository } from "./repositories/BookRepository";
import { MemberRepository } from "./repositories/MemberRepository";
import { LibraryService } from "./services/LibraryService";
import { PremiumFineCalculator } from "./strategies/PremiumFineCalculator";
import { SimpleFineCalculator } from "./strategies/SimpleFineCalculator";
import { Logger } from "./utils/Logger";

const eventBus = new EventBus();
const bookRepo = new BookRepository();
const memberRepo = new MemberRepository();
const fineStrategies: FineStrategies = {
  Regular: new SimpleFineCalculator(10, 14),
  Premium: new PremiumFineCalculator(5, 20),
};

const libraryService = new LibraryService(memberRepo, bookRepo, fineStrategies, eventBus);

// Event subscriptions
eventBus.subscribe(EventTypeEnum.NEW_BOOK_ADDED, (data: unknown) => {
  const { newBook } = data as { newBook: Book };
  Logger.info(`EVENT: New book added -> ${newBook.title} by ${newBook.author}`);
});

eventBus.subscribe(EventTypeEnum.BOOK_RETURNED, (data: unknown) => {
  const { memberId, bookId } = data as { memberId: number; bookId: number };
  Logger.info(`EVENT: Member ${memberId} returned book ${bookId}`);
});
eventBus.subscribe(EventTypeEnum.BOOK_OVERDUE, (data: unknown) => {
  const { memberId, bookId } = data as { memberId: number; bookId: number };
  Logger.info(`EVENT: Notify member ${memberId}: Book ${bookId} is overdue`);
});

(async () => {
  // Add books
  const book1 = await libraryService.addBook("The Great Gatsby", "F. Scott Fitzgerald");
  const book2 = await libraryService.addBook("1984", "George Orwell");
  await libraryService.addBook("Brave New World", "Aldous Huxley");

  // Register members
  const alice = await libraryService.registerMember("Alice");
  const bob = await libraryService.registerMember("Bob");

  Logger.info(`Registered members: ${alice.name} (ID:${alice.id}), ${bob.name} (ID:${bob.id})`);

  // Borrow books
  await libraryService.borrowBook(alice.id, book1.id);
  await libraryService.borrowBook(bob.id, book2.id);

  Logger.info(`${alice.name} borrowed "${book1.title}"`);
  Logger.info(`${bob.name} borrowed "${book2.title}"`);

  // Try to borrow an already borrowed book
  try {
    await libraryService.borrowBook(alice.id, book2.id);
  } catch (err: unknown) {
    if (err instanceof Error) Logger.error(`Error: ${err.message}`);
  }

  // Return a book
  await libraryService.returnBook(alice.id, book1.id);

  // List available books
  const availableBooks = await libraryService.listAvailableBooks();
  Logger.info(`Available books: ${availableBooks.map((b) => b.title).join(", ")}`);

  // Calculate fines (simulate overdue)
  // Manually manipulate borrowed date to simulate overdue
  const borrowedBook = bob.borrowedBooks[0];
  borrowedBook.borrowedDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
  const fine = await libraryService.calculateFine(bob.id, borrowedBook.book.id);
  Logger.info(`Fine for ${bob.name} on "${borrowedBook.book.title}" is $${fine}`);

  // Trigger overdue event manually
  eventBus.publish(EventTypeEnum.BOOK_OVERDUE, { memberId: bob.id, bookId: borrowedBook.book.id });
})();
