import { MemberType } from "../entities/Member";

/**
 * Interface representing a fine calculation strategy.
 * Implementations define how fines are calculated based on overdue days.
 */
export interface IFineCalculator {
  /**
   * Calculates the fine for a given number of days late.
   * @param daysLate Number of days the book is overdue
   * @returns Fine amount as a number
   */
  calculateFine(daysLate: number): number;
}

/**
 * FineStrategies
 *
 * Maps each member type to a specific fine calculator strategy.
 * Allows different fine calculation rules for "Regular" and "Premium" members.
 */
export type FineStrategies = Record<MemberType, IFineCalculator>;
