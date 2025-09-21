import { Book } from "../../../entities/Book";
import { Member, MemberType } from "../../../entities/Member";
import { MemberLimitExceededError } from "../../../errors/MemberLimitExceededError";

const Members: Record<MemberType, MemberType> = {
  Premium: "Premium",
  Regular: "Regular",
};

describe("Member Entity", () => {
  it("should create a new member with empty borrowedBooks", () => {
    const member = new Member(1, "John Doe", Members.Regular);
    expect(member.borrowedBooks.length).toBe(0);
    expect(member.name).toBe("John Doe");
    expect(member.memberType).toBe(Members.Regular);
  });

  it("should create a Premium member with custom maxBooksAllowed", () => {
    const member = new Member(2, "Jane Doe", Members.Premium, 5);
    expect(member.borrowedBooks.length).toBe(0);
    expect(member.name).toBe("Jane Doe");
    expect(member.memberType).toBe(Members.Premium);
    expect(member.maxBooksAllowed).toBe(5);
  });

  it("should add borrowed book correctly", () => {
    const member = new Member(1, "John Doe", Members.Regular);
    const book = new Book(101, "Test Book", "Author");
    member.borrowBook(book);
    expect(member.borrowedBooks.find((b) => b.book.id === 101)).toBeTruthy();
    expect(member.borrowedBooks.length).toBe(1);
  });

  it("should remove returned book correctly", () => {
    const member = new Member(1, "John Doe", Members.Regular);
    const book = new Book(101, "Test Book", "Author");
    member.borrowBook(book);
    expect(member.borrowedBooks.find((b) => b.book.id === 101)).toBeTruthy();

    member.returnBook(book);
    expect(member.borrowedBooks.find((b) => b.book.id === 101)).toBeFalsy();
    expect(member.borrowedBooks.length).toBe(0);
  });

  it("should not exceed borrowing limit for Regular members", () => {
    const member = new Member(1, "John Doe", Members.Regular, 3);
    const book1 = new Book(101, "Book 1", "Author");
    const book2 = new Book(102, "Book 2", "Author");
    const book3 = new Book(103, "Book 3", "Author");
    const book4 = new Book(104, "Book 4", "Author");

    member.borrowBook(book1);
    member.borrowBook(book2);
    member.borrowBook(book3);
    expect(member.borrowedBooks.length).toBe(3);

    // Attempt to borrow a fourth book

    // Should still be 3 as Regular members can only borrow up to 3 books
    expect(() => member.borrowBook(book4)).toThrow(new MemberLimitExceededError(member.id));
  });

  it("should allow more books for Premium members", () => {
    const member = new Member(1, "Jane Doe", Members.Premium, 5);
    const book1 = new Book(201, "Book 1", "Author");
    const book2 = new Book(202, "Book 2", "Author");
    const book3 = new Book(203, "Book 3", "Author");
    const book4 = new Book(204, "Book 4", "Author");

    member.borrowBook(book1);
    member.borrowBook(book2);
    member.borrowBook(book3);
    member.borrowBook(book4);
    expect(member.borrowedBooks.length).toBe(4);
  });
});
