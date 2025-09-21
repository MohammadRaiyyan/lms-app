export class BookNotAvailableError extends Error {
  constructor(bookId: number) {
    super(`Book with ID ${bookId} is not available.`);
    this.name = "BookNotAvailableError";
  }
}
