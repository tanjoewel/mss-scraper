export class ParsingError extends Error {
  constructor(source: string, message: string) {
    super(message);
    this.name = "ParsingError";
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}

type ParseFrame = {
  step: string;
  detail?: string;
};

/**
 * An attempt to make a custom error that supports stack trace.
 */
export class ParseError extends Error {
  stackTrace: ParseFrame[];

  constructor(message: string, stackTrace: ParseFrame[] = []) {
    super(message);
    this.name = "ParseError";
    this.stackTrace = stackTrace;
    Object.setPrototypeOf(this, ParseError.prototype);
  }

  push(frame: ParseFrame) {
    this.stackTrace.unshift(frame);
    return this;
  }
}
