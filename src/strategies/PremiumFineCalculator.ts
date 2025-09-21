import { IFineCalculator } from "../contracts/IFineCalculator";

export class PremiumFineCalculator implements IFineCalculator {
  private finePerDay: number;
  private allowedDays: number;

  constructor(finePerDay: number, allowedDays: number) {
    this.finePerDay = finePerDay;
    this.allowedDays = allowedDays;
  }
  calculateFine(daysLate: number): number {
    return Math.max(0, (daysLate - this.allowedDays) * this.finePerDay);
  }
}
