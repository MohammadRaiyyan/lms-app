import { PremiumFineCalculator } from "../../../strategies/PremiumFineCalculator";

describe("PremiumFineCalculator", () => {
  it("should return 0 fine within grace period", () => {
    const calculator = new PremiumFineCalculator(5, 20);
    expect(calculator.calculateFine(18)).toBe(0);
    expect(calculator.calculateFine(20)).toBe(0);
  });

  it("should calculate fine after grace period", () => {
    const calculator = new PremiumFineCalculator(5, 20);
    expect(calculator.calculateFine(22)).toBe(10);
    expect(calculator.calculateFine(25)).toBe(25);
  });
});
