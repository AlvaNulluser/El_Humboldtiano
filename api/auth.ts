/**
 * Vercel Serverless Function — GitHub OAuth for StaticCMS
 *
 * Handles the OAuth2 Authorization Code flow for the GitHub backend.
 * StaticCMS opens this endpoint in a popup to authenticate users.
 *
 * Required environment variables (set in Vercel dashboard):
 *   - GITHUB_CLIENT_ID
 *   - GITHUB_CLIENT_SECRET
 *
 * Flow:
 *   1. CMS popup → GET /api/auth (no code) → redirect to GitHub authorize
 *   2. GitHub redirects back with ?code=... → exchange for access token
 *   3. Return HTML that posts the token back to the CMS parent window
 *      using the NetlifyAuthenticator string-based postMessage protocol.
 *
 * Protocol: postMessage("authorizing:github", "*") handshake,
 *           then postMessage("authorization:github:success:{json}", "*").
 *           StaticCMS v3 NetlifyAuthenticator uses indexOf to parse strings,
 *           so the payload MUST be a concatenated string, not an object.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const SCOPE = "repo,user";

/**
 * Return an HTML error page. The popup expects HTML; returning JSON causes
 * an opaque blank page instead of a visible error.
 */
function htmlErrorPage(title: string, detail: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(detail)}</p>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // Only allow GET requests
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  // ── Missing environment variables → HTML error page ────────────────────
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    const missing: string[] = [];
    if (!GITHUB_CLIENT_ID) missing.push("GITHUB_CLIENT_ID");
    if (!GITHUB_CLIENT_SECRET) missing.push("GITHUB_CLIENT_SECRET");

    res
      .status(500)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(
        htmlErrorPage(
          "Error de configuración",
          `missing_env_vars: ${missing.join(", ")} must be set in Vercel environment variables.`,
        ),
      );
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "el-humboldtiano.vercel.app";
  const origin = `${protocol}://${host}`;

  const code = req.query.code as string | undefined;

  // ── Step 1: No code → redirect to GitHub authorization page ────────────
  if (!code) {
    const redirectUri = `${origin}/api/auth`;
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: SCOPE,
    });

    res.redirect(
      302,
      `https://github.com/login/oauth/authorize?${params.toString()}`,
    );
    return;
  }

  // ── Step 2: Code received → exchange for access token ──────────────────
  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      res
        .status(400)
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .send(
          htmlErrorPage(
            "Error de autenticación",
            `GitHub returned: ${tokenData.error}${tokenData.error_description ? ` — ${tokenData.error_description}` : ""}`,
          ),
        );
      return;
    }

    // Return HTML that posts the token back via the NetlifyAuthenticator
    // STRING protocol. The key insight: NetlifyAuthenticator in StaticCMS
    // uses e.data.indexOf("authorization:github:success:") to parse the
    // message, so postMessage MUST receive a string, not an object.
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
<script>
  (function() {
    // Handshake — tells CMS parent the popup is ready
    if (window.opener) {
      window.opener.postMessage("authorizing:github", "*");
    }
    // Success — NetlifyAuthenticator expects the string format:
    // "authorization:github:success:{json}"
    var authData = JSON.stringify({token: ${JSON.stringify(tokenData.access_token)}, provider: "github"});
    if (window.opener) {
      window.opener.postMessage("authorization:github:success:" + authData, "*");
    }
    window.close();
  })();
</script>
<p>Autenticado. Cerrando ventana…</p>
</body>
</html>`;

    res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(html);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(
        htmlErrorPage("Error interno", `Token exchange failed: ${message}`),
      );
  }
}
