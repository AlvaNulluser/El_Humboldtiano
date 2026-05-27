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
 */

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";

export default async function handler(request: Request): Promise<Response> {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return new Response(
      JSON.stringify({
        error: "missing_env_vars",
        message:
          "GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set in Vercel environment variables.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Step 1: No code yet → redirect to GitHub authorization page
  if (!code) {
    // redirect_uri must point back to THIS same endpoint so GitHub
    // returns here with the authorization code
    const redirectUri = url.origin + "/api/auth";

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: "repo,user",
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
      },
    });
  }

  // Step 2: Code received → exchange for access token
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
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return an HTML page that posts the token back to the CMS parent window.
    // StaticCMS expects a postMessage from the popup with { type, token }.
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
<script>
(function() {
  var token = ${JSON.stringify(tokenData.access_token)};
  // Post the token back to the StaticCMS parent window
  if (window.opener) {
    window.opener.postMessage(
      { type: "authorization", token: token },
      "*"
    );
  }
  // Also support the Netlify-style callback for compatibility
  if (window.opener && window.opener.netlify) {
    window.opener.netlify.authenticate({ token: token });
  }
  window.close();
})();
</script>
<p>Autenticado. Cerrando ventana…</p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: "token_exchange_failed", message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}