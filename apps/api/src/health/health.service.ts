import { Injectable } from "@nestjs/common";

export type HealthCheckName = "process" | "database";
export type HealthCheckStatus = "ok" | "not_configured";

export interface HealthCheck {
  readonly name: HealthCheckName;
  readonly status: HealthCheckStatus;
}

export interface HealthStatus {
  readonly service: "api";
  readonly status: "ok";
  readonly checkedAt: string;
  readonly checks: readonly HealthCheck[];
}

export function createHealthStatus(checks: readonly HealthCheck[], checkedAt: Date): HealthStatus {
  return {
    service: "api",
    status: "ok",
    checkedAt: checkedAt.toISOString(),
    checks
  };
}

@Injectable()
export class HealthService {
  public live(): HealthStatus {
    return createHealthStatus(
      [
        {
          name: "process",
          status: "ok"
        }
      ],
      new Date()
    );
  }

  public ready(): HealthStatus {
    return createHealthStatus(
      [
        {
          name: "process",
          status: "ok"
        },
        {
          name: "database",
          status: "not_configured"
        }
      ],
      new Date()
    );
  }
}
