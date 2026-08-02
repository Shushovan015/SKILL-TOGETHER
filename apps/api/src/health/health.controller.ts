import { Controller, Get } from "@nestjs/common";

import { type HealthStatus, HealthService } from "./health.service.js";

@Controller("health")
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Get("live")
  public live(): HealthStatus {
    return this.healthService.live();
  }

  @Get("ready")
  public async ready(): Promise<HealthStatus> {
    return this.healthService.ready();
  }
}
