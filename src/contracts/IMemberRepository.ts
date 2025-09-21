import { Member } from "../entities/Member";

/**
 * IMemberRepository
 *
 * Interface representing a repository for managing Member entities.
 * Provides methods for basic CRUD operations.
 */
export interface IMemberRepository {
  /**
   * Adds a member to the repository.
   * @param member Member instance to add
   * @returns Promise that resolves to the added Member
   */
  addMember(member: Member): Promise<Member>;

  /**
   * Deletes a member from the repository by its ID.
   * @param id ID of the member to delete
   * @returns Promise that resolves once the member is deleted
   */
  deleteMember(id: number): Promise<void>;

  /**
   * Finds a member by their ID.
   * @param id ID of the member to find
   * @returns Promise that resolves to the Member instance if found, otherwise undefined
   */
  findById(id: number): Promise<Member | undefined>;

  /**
   * Lists all members in the repository.
   * @returns Promise that resolves to a readonly array of all members
   */
  list(): Promise<ReadonlyArray<Member>>;
}
