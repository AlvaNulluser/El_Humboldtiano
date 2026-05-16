import { test, expect } from "@playwright/test";

test("la portada devuelve HTTP 200", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});
