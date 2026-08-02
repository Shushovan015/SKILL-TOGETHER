import { describe, expect, it } from "vitest";

import { PasswordService, argon2idParameters } from "./password.service.js";

describe("PasswordService", () => {
  it("hashes passwords with Argon2id and verifies only the matching password", async () => {
    const service = new PasswordService();
    const password = "ValidPass123!";

    const passwordHash = await service.hashPassword(password);

    expect(passwordHash).not.toContain(password);
    expect(passwordHash.startsWith("$argon2id$")).toBe(true);
    expect(argon2idParameters.memoryCostKiB).toBe(19_456);
    await expect(service.verifyPassword(passwordHash, password)).resolves.toBe(true);
    await expect(service.verifyPassword(passwordHash, "WrongPass123!")).resolves.toBe(false);
  });
});
