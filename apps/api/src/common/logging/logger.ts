export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogMetadataValue = string | number | boolean | null;

export type LogMetadata = Readonly<Record<string, LogMetadataValue>>;

export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly requestId?: string;
  readonly metadata?: LogMetadata;
}

export interface AppLogger {
  readonly write: (entry: LogEntry) => void;
}

const sensitiveKeyFragments = ["password", "secret", "token", "cookie", "session"];

export function redactMetadata(metadata: LogMetadata): LogMetadata {
  const redacted: Record<string, LogMetadataValue> = {};

  for (const [key, value] of Object.entries(metadata)) {
    const normalizedKey = key.toLowerCase();
    const isSensitive = sensitiveKeyFragments.some((fragment) => normalizedKey.includes(fragment));
    redacted[key] = isSensitive ? "[REDACTED]" : value;
  }

  return redacted;
}

export class ConsoleAppLogger implements AppLogger {
  public write(entry: LogEntry): void {
    const metadata = entry.metadata === undefined ? undefined : redactMetadata(entry.metadata);
    const payload = JSON.stringify({
      level: entry.level,
      message: entry.message,
      requestId: entry.requestId,
      metadata
    });

    if (entry.level === "error") {
      console.error(payload);
      return;
    }

    if (entry.level === "warn") {
      console.warn(payload);
      return;
    }

    console.log(payload);
  }
}
