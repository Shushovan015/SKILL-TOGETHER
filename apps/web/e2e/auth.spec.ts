import { expect, test } from "@playwright/test";

test("registers, logs out, and logs back in", async ({ page }) => {
  const email = `learner-${Date.now()}@example.test`;
  const password = "ValidPass123!";

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByLabel("Display name").fill("Phase Two Learner");
  await page.getByLabel("Time zone").fill("Europe/Berlin");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();

  await page.goto("/");
  await expect(page).not.toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
});
