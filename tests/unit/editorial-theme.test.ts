import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  resolveTheme,
  EDITORIAL_CONFIG,
  type EditorialTheme,
  type EditorialConfig,
} from "../../src/config/editorial";

describe("Editorial Theme Configuration & Resolution", () => {
  const originalEnv = process.env.PUBLIC_EDITORIAL_THEME;

  beforeEach(() => {
    delete process.env.PUBLIC_EDITORIAL_THEME;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.PUBLIC_EDITORIAL_THEME = originalEnv;
    } else {
      delete process.env.PUBLIC_EDITORIAL_THEME;
    }
  });

  describe("EDITORIAL_CONFIG defaults", () => {
    it("should export default configuration with modern theme and runtime toggle enabled", () => {
      expect(EDITORIAL_CONFIG.defaultTheme).toBe("modern");
      expect(EDITORIAL_CONFIG.allowRuntimeToggle).toBe(true);
    });
  });

  describe("Tier 1: URL Query Parameter Precedence", () => {
    it("should resolve 'classic' when ?theme=classic is passed in URL", () => {
      const url = new URL("https://elhumboldtiano.uah.ve/?theme=classic");
      expect(resolveTheme(url)).toBe("classic");
    });

    it("should resolve 'modern' when ?theme=modern is passed in URL", () => {
      const url = new URL("https://elhumboldtiano.uah.ve/articulo/test?theme=modern");
      expect(resolveTheme(url)).toBe("modern");
    });

    it("should override PUBLIC_EDITORIAL_THEME when URL query param is present", () => {
      process.env.PUBLIC_EDITORIAL_THEME = "classic";
      const url = new URL("https://elhumboldtiano.uah.ve/?theme=modern");
      expect(resolveTheme(url)).toBe("modern");

      process.env.PUBLIC_EDITORIAL_THEME = "modern";
      const urlClassic = new URL("https://elhumboldtiano.uah.ve/?theme=classic");
      expect(resolveTheme(urlClassic)).toBe("classic");
    });

    it("should handle case-insensitivity and trim in query param", () => {
      const url1 = new URL("https://elhumboldtiano.uah.ve/?theme=CLASSIC");
      expect(resolveTheme(url1)).toBe("classic");

      const url2 = new URL("https://elhumboldtiano.uah.ve/?theme=MoDeRn");
      expect(resolveTheme(url2)).toBe("modern");
    });
  });

  describe("Tier 2: Environment Variable Resolution", () => {
    it("should resolve theme from PUBLIC_EDITORIAL_THEME when no URL param is present", () => {
      process.env.PUBLIC_EDITORIAL_THEME = "classic";
      expect(resolveTheme()).toBe("classic");

      const urlWithoutParam = new URL("https://elhumboldtiano.uah.ve/archivo/1");
      expect(resolveTheme(urlWithoutParam)).toBe("classic");
    });

    it("should handle modern value in PUBLIC_EDITORIAL_THEME", () => {
      process.env.PUBLIC_EDITORIAL_THEME = "modern";
      expect(resolveTheme()).toBe("modern");
    });
  });

  describe("Tier 3: Default Fallback", () => {
    it("should fallback to defaultTheme ('modern') when no URL param and no env var exist", () => {
      expect(resolveTheme()).toBe("modern");

      const urlWithoutParam = new URL("https://elhumboldtiano.uah.ve/");
      expect(resolveTheme(urlWithoutParam)).toBe("modern");
    });
  });

  describe("Edge cases & Invalid input sanitization", () => {
    it("should fallback safely to env or default when query param is unknown/invalid", () => {
      const invalidUrl = new URL("https://elhumboldtiano.uah.ve/?theme=futuristic");
      expect(resolveTheme(invalidUrl)).toBe("modern");

      process.env.PUBLIC_EDITORIAL_THEME = "classic";
      expect(resolveTheme(invalidUrl)).toBe("classic");
    });

    it("should fallback safely when query param is empty", () => {
      const emptyParamUrl = new URL("https://elhumboldtiano.uah.ve/?theme=");
      expect(resolveTheme(emptyParamUrl)).toBe("modern");
    });

    it("should fallback safely when PUBLIC_EDITORIAL_THEME is invalid", () => {
      process.env.PUBLIC_EDITORIAL_THEME = "invalid_theme";
      expect(resolveTheme()).toBe("modern");
    });

    it("should safely handle undefined or non-URL inputs", () => {
      expect(resolveTheme(undefined)).toBe("modern");
    });
  });
});
