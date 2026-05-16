import { test, expect } from "@playwright/test";

test("/archivo/1 devuelve HTTP 200", async ({ page }) => {
  const response = await page.goto("/archivo/1");
  expect(response?.status()).toBe(200);
});
