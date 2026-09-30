import { describe, it, expect } from "vitest";
import { EDITORIAL_CONFIG } from "../../src/config/editorial";

describe("Editorial Newspaper Configuration", () => {
  it("should have correct publication metadata", () => {
    expect(EDITORIAL_CONFIG.name).toBe("El Humboldtiano");
    expect(EDITORIAL_CONFIG.tagline).toBe("Periódico Virtual UAH");
    expect(EDITORIAL_CONFIG.edition).toBe("Edición Digital");
    expect(EDITORIAL_CONFIG.location).toBe("Caracas, Venezuela");
    expect(EDITORIAL_CONFIG.institution).toBe("Universidad Alejandro de Humboldt");
    expect(EDITORIAL_CONFIG.siteUrl).toBe("https://el-humboldtiano.vercel.app");
  });
});
