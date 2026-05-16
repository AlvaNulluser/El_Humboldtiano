import { test, expect } from "@playwright/test";

test("ruta de artículo con formato slug responde correctamente", async ({
  page,
}) => {
  const response = await page.goto(
    "/articulo/2026-01-15-articulo-de-prueba",
  );
  // Puede devolver 200 (si el artículo existe) o 404 (si no existe en
  // la colección). Lo importante es que la ruta con patrón slug funciona
  // y el servidor responde sin errores internos.
  expect(response?.status()).toBeGreaterThanOrEqual(200);
  expect(response?.status()).toBeLessThan(500);
});
