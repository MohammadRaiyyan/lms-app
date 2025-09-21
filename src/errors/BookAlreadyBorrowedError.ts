export class BookAlreadyBorrowedError extends Error {
  constructor(bookId: number) {
    super(`Book with ID ${bookId} is already borrowed.`);
    this.name = "BookAlreadyBorrowedError";
  }
}
