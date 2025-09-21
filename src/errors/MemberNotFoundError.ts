export class MemberNotFoundError extends Error {
  constructor(memberId: number) {
    super(`Member with ID ${memberId} not found.`);
    this.name = "MemberNotFoundError";
  }
}
