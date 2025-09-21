import { SimpleFineCalculator } from "../../../strategies/SimpleFineCalculator";

describe("SimpleFineCalculator", () => {
  it("should return 0 fine if returned on time", () => {
    const calculator = new SimpleFineCalculator(2, 14);
    expect(calculator.calculateFine(10)).toBe(0);
    expect(calculator.calculateFine(14)).toBe(0);
  });

  it("should calculate fine correctly when overdue", () => {
    const calculator = new SimpleFineCalculator(2, 14);
    expect(calculator.calculateFine(16)).toBe(4);
    expect(calculator.calculateFine(20)).toBe(12);
  });
});
