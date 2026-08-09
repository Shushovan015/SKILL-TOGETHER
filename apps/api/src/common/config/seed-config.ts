export function shouldSeedOnStartup(): boolean {
  const configured = process.env["SEED_ON_STARTUP"]?.trim().toLowerCase();

  if (configured === "true") {
    return true;
  }

  if (configured === "false") {
    return false;
  }

  return process.env["NODE_ENV"] !== "production";
}
