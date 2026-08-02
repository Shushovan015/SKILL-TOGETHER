export interface AppErrorOptions {
  readonly code: string;
  readonly message: string;
  readonly retryable: boolean;
  readonly cause?: unknown;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly retryable: boolean;
  public override readonly cause?: unknown;

  public constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.retryable = options.retryable;
    this.cause = options.cause;
  }
}
