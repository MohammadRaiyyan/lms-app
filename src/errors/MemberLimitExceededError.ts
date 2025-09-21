export class MemberLimitExceededError extends Error {
  constructor(memberId: number) {
    super(`Member with ID ${memberId} has reached maximum borrowed books.`);
    this.name = "MemberLimitExceededError";
  }
}
