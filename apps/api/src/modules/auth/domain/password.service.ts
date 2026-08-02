import { Injectable } from "@nestjs/common";
import { hash, verify } from "@node-rs/argon2";

export const argon2idParameters = {
  algorithm: "Argon2id",
  memoryCostKiB: 19_456,
  timeCost: 3,
  parallelism: 1,
  outputLength: 32
} as const;

@Injectable()
export class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    return hash(password, {
      algorithm: 2,
      memoryCost: argon2idParameters.memoryCostKiB,
      timeCost: argon2idParameters.timeCost,
      parallelism: argon2idParameters.parallelism,
      outputLen: argon2idParameters.outputLength
    });
  }

  public async verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    return verify(passwordHash, password);
  }
}
