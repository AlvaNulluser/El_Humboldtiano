/**
 * Editorial Theme Configuration & Resolution System
 *
 * Implements a strict 3-tier precedence hierarchy:
 * 1. URL Query Parameter (?theme=modern|classic)
 * 2. Environment Variable (PUBLIC_EDITORIAL_THEME)
 * 3. Default Configuration (EDITORIAL_CONFIG.defaultTheme)
 */

export type EditorialTheme = "classic" | "modern";

export interface EditorialConfig {
  defaultTheme: EditorialTheme;
  allowRuntimeToggle: boolean;
}

export const EDITORIAL_CONFIG: EditorialConfig = {
  defaultTheme: "modern",
  allowRuntimeToggle: true,
};

/**
 * Validates and sanitizes a candidate theme string.
 * Returns the normalized EditorialTheme or null if invalid.
 */
function sanitizeTheme(value: string | null | undefined): EditorialTheme | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "classic" || normalized === "modern") {
    return normalized;
  }
  return null;
}

/**
 * Resolves the active theme for a given request or context.
 *
 * @param url Optional request URL object containing potential query parameters
 * @returns Resolved theme ('classic' | 'modern')
 */
export function resolveTheme(url?: URL): EditorialTheme {
  // Tier 1: URL query parameter override (highest priority)
  if (EDITORIAL_CONFIG.allowRuntimeToggle && url && typeof url.searchParams?.get === "function") {
    const param = url.searchParams.get("theme");
    const themeFromParam = sanitizeTheme(param);
    if (themeFromParam) {
      return themeFromParam;
    }
  }

  // Tier 2: Environment variable
  let envTheme: string | undefined;
  if (typeof process !== "undefined" && process.env?.PUBLIC_EDITORIAL_THEME) {
    envTheme = process.env.PUBLIC_EDITORIAL_THEME;
  } else if (
    typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.PUBLIC_EDITORIAL_THEME
  ) {
    envTheme = (import.meta as unknown as { env: Record<string, string> }).env.PUBLIC_EDITORIAL_THEME;
  }

  const themeFromEnv = sanitizeTheme(envTheme);
  if (themeFromEnv) {
    return themeFromEnv;
  }

  // Tier 3: Default fallback
  return EDITORIAL_CONFIG.defaultTheme;
}
