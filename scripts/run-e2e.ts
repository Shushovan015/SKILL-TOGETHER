import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const apiPort = "4100";
const webPort = "5174";
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const webOrigin = `http://127.0.0.1:${webPort}`;
const sessionSecret = "test-session-secret-for-playwright-0001";
const csrfSecret = "test-csrf-secret-for-playwright-000001";

interface ManagedProcess {
  readonly name: string;
  readonly process: ChildProcess;
}

const managedProcesses: ManagedProcess[] = [];
let stopping = false;

async function main(): Promise<void> {
  const api = startManagedProcess("api", process.execPath, ["apps/api/dist/main.js"], {
    NODE_ENV: "test",
    AUTH_PERSISTENCE: "memory",
    API_PORT: apiPort,
    WEB_ORIGIN: webOrigin,
    CORS_ALLOWED_ORIGINS: `${webOrigin},http://localhost:${webPort}`,
    DATABASE_URL:
      "postgresql://skilltogether:skilltogether_test_password@localhost:5432/skilltogether_test",
    SESSION_SECRET: sessionSecret,
    CSRF_SECRET: csrfSecret
  });
  const web = startManagedProcess(
    "web",
    process.execPath,
    [
      "apps/web/node_modules/vite/bin/vite.js",
      "apps/web",
      "--host",
      "127.0.0.1",
      "--port",
      webPort,
      "--strictPort"
    ],
    {
      VITE_API_URL: `${apiOrigin}/graphql`
    }
  );

  try {
    await Promise.all([
      waitForHttp(`${apiOrigin}/health/live`, api),
      waitForHttp(webOrigin, web)
    ]);

    process.exitCode = await runCommand(process.execPath, [
      "node_modules/@playwright/test/cli.js",
      "test",
      "-c",
      "apps/web/playwright.config.ts"
    ]);
  } finally {
    await stopManagedProcesses();
  }
}

function startManagedProcess(
  name: string,
  command: string,
  args: readonly string[],
  env: Readonly<Record<string, string>>
): ManagedProcess {
  const childProcess = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...env
    },
    shell: false,
    stdio: "inherit",
    windowsHide: true
  });

  const managedProcess = {
    name,
    process: childProcess
  };
  managedProcesses.push(managedProcess);
  return managedProcess;
}

async function waitForHttp(url: string, managedProcess: ManagedProcess): Promise<void> {
  const startedAt = Date.now();
  const timeoutMs = 120_000;

  while (Date.now() - startedAt < timeoutMs) {
    if (managedProcess.process.exitCode !== null) {
      throw new Error(`${managedProcess.name} exited before ${url} became available`);
    }

    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      await delay(250);
    }
  }

  throw new Error(`${url} did not become available within ${timeoutMs}ms`);
}

async function runCommand(command: string, args: readonly string[]): Promise<number> {
  const childProcess = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    stdio: "inherit",
    windowsHide: true
  });

  return new Promise((resolve) => {
    childProcess.on("exit", (code) => {
      resolve(code ?? 1);
    });
  });
}

async function stopManagedProcesses(): Promise<void> {
  stopping = true;
  await Promise.all(managedProcesses.map((managedProcess) => stopProcess(managedProcess.process)));
}

async function stopProcess(childProcess: ChildProcess): Promise<void> {
  if (childProcess.pid === undefined || childProcess.exitCode !== null) {
    return;
  }

  childProcess.kill("SIGTERM");
  await delay(250);
}

process.on("SIGINT", () => {
  if (!stopping) {
    void stopManagedProcesses().finally(() => {
      process.exitCode = 130;
    });
  }
});

void main().catch(async (error: unknown) => {
  console.error(error);
  await stopManagedProcesses();
  process.exitCode = 1;
});
