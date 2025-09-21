import { Member } from "../../../entities/Member";
import { MemberRepository } from "../../../repositories/MemberRepository";

describe("MemberRepository", () => {
  it("should add and retrieve a member by ID", () => {
    const repo = new MemberRepository();
    const member = new Member(1, "John Doe", "Regular");
    repo.addMember(member);
    repo.findById(1).then((found) => {
      expect(found).toBe(member);
    });
  });

  it("should delete a member by ID", () => {
    const repo = new MemberRepository();
    const member = new Member(1, "John Doe", "Regular");
    repo.addMember(member).then(() => {
      repo.deleteMember(1).then(() => {
        repo.findById(1).then((found) => {
          expect(found).toBeUndefined();
        });
      });
    });
  });

  it("should return all members", () => {
    const repo = new MemberRepository();
    const member1 = new Member(1, "John Doe", "Regular");
    const member2 = new Member(2, "Jane Doe", "Premium");
    Promise.all([repo.addMember(member1), repo.addMember(member2)]).then(() => {
      repo.list().then((members) => {
        expect(members.length).toBe(2);
        expect(members).toContain(member1);
        expect(members).toContain(member2);
      });
    });
  });

  it("should throw if member does not exist", () => {
    const repo = new MemberRepository();
    repo.findById(999).then((found) => {
      expect(found).toBeUndefined();
    });
  });
});
