import { Injectable } from "@nestjs/common";

import { ApiConfigService } from "../common/config/api-config.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

export type HealthCheckName = "process" | "database";
export type HealthCheckStatus = "down" | "ok" | "not_configured";

export interface HealthCheck {
  readonly name: HealthCheckName;
  readonly status: HealthCheckStatus;
}

export interface HealthStatus {
  readonly service: "api";
  readonly status: "degraded" | "ok";
  readonly checkedAt: string;
  readonly checks: readonly HealthCheck[];
}

export function createHealthStatus(
  checks: readonly HealthCheck[],
  checkedAt: Date,
  status: "degraded" | "ok" = "ok"
): HealthStatus {
  return {
    service: "api",
    status,
    checkedAt: checkedAt.toISOString(),
    checks
  };
}

@Injectable()
export class HealthService {
  public constructor(
    private readonly configService: ApiConfigService,
    private readonly prismaService: PrismaService
  ) {}

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

  public async ready(): Promise<HealthStatus> {
    const databaseCheck = await this.database();

    return createHealthStatus(
      [
        {
          name: "process",
          status: "ok"
        },
        databaseCheck
      ],
      new Date(),
      databaseCheck.status === "down" ? "degraded" : "ok"
    );
  }

  private async database(): Promise<HealthCheck> {
    if (
      this.configService.value.authPersistence === "memory" ||
      this.configService.value.databaseUrl === undefined
    ) {
      return {
        name: "database",
        status: "not_configured"
      };
    }

    try {
      await this.prismaService.$queryRaw`SELECT 1`;

      return {
        name: "database",
        status: "ok"
      };
    } catch {
      return {
        name: "database",
        status: "down"
      };
    }
  }
}
