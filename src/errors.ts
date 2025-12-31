export class ParsingError extends Error {
  constructor(source: string, message: string) {
    super(message);
    this.name = 'ParsingError';
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}