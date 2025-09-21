export class BookAlreadyReturnedError extends Error {
  constructor(bookId: number) {
    super(`Book with ID ${bookId} is already returned.`);
    this.name = "BookAlreadyReturnedError";
  }
}
