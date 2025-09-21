import { IMemberRepository } from "../contracts/IMemberRepository";
import { Member } from "../entities/Member";

/**
 * MemberRepository
 *
 * In-memory implementation of the IMemberRepository.
 * Provides CRUD operations for managing library members.
 */
export class MemberRepository implements IMemberRepository {
  /** Internal storage for members */
  private members: Member[] = [];

  /**
   * Adds a member to the repository
   * @param member Member instance to add
   * @returns The same member that was added
   */
  async addMember(member: Member): Promise<Member> {
    this.members.push(member);
    return member;
  }

  /**
   * Deletes a member from the repository by its ID
   * @param id ID of the member to delete
   */
  async deleteMember(id: number): Promise<void> {
    this.members = this.members.filter((member) => member.id !== id);
  }

  /**
   * Finds a member by their ID
   * @param id ID of the member to find
   * @returns The Member instance if found, otherwise undefined
   */
  async findById(id: number): Promise<Member | undefined> {
    return this.members.find((member) => member.id === id);
  }

  /**
   * Lists all members in the repository
   * @returns Readonly array of all members
   */
  async list(): Promise<ReadonlyArray<Member>> {
    return this.members;
  }
}
