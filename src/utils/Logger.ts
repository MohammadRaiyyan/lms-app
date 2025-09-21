export class Logger {
  private static reset = "\x1b[0m";
  private static fgRed = "\x1b[31m";
  private static fgGreen = "\x1b[32m";
  private static fgBlue = "\x1b[34m";
  private static fgYellow = "\x1b[33m";

  static info(message: string) {
    console.log(`${this.fgBlue}[INFO]${this.reset} ${message}`);
  }

  static warn(message: string) {
    console.log(`${this.fgYellow}[WARN]${this.reset} ${message}`);
  }

  static error(message: string) {
    console.error(`${this.fgRed}[ERROR]${this.reset} ${message}`);
  }

  static success(message: string) {
    console.log(`${this.fgGreen}[SUCCESS]${this.reset} ${message}`);
  }
}
