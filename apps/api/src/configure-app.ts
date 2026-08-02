import type { INestApplication } from "@nestjs/common";
import cookieParser from "cookie-parser";

import { ApiConfigService } from "./common/config/api-config.service.js";

export function configureApplication(app: INestApplication): void {
  const config = app.get(ApiConfigService).value;

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
      if (origin === undefined || config.corsAllowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin is not allowed"));
    }
  });
  app.enableShutdownHooks();
}
