# Security

Use the **security-reviewer** agent and **/security-review** skill for comprehensive checks.

## Pre-commit Checklist

- [ ] No hardcoded secrets (API keys, passwords, tokens, encryption keys)
- [ ] All private API routes verify Supabase auth (`serverSupabaseUser(event)`)
- [ ] User inputs validated with Zod schemas
- [ ] OAuth tokens encrypted with AES-256-GCM before DB storage
- [ ] Error messages don't leak sensitive data (no token values, no stack traces)
- [ ] No raw SQL — always use Drizzle query builder
- [ ] Supabase RLS enabled on all tables

## OAuth Token Security

- Tokens stored encrypted in `social_accounts.access_token` / `refresh_token`
- Encryption key: `NUXT_TOKEN_ENCRYPTION_KEY` (32-byte hex, env variable)
- Never log or expose tokens in API responses
- Refresh tokens before expiry (IG: 60 days, cron refreshes at 50 days)
- On token error: mark `is_connected = false`, prompt user to re-connect

## Supabase RLS Rules

| Table | SELECT | INSERT/UPDATE | DELETE |
|-------|--------|---------------|--------|
| profiles | Public if `is_public=true`, else owner only | Owner only (`auth.uid()=id`) | No |
| social_accounts | Owner only | Owner only | Owner only |
| analytics_snapshots | Owner (via FK) | Server only (`service_role`) | No |
| media_kits | Owner + public view (pdf_url) | Owner only | Owner only |

## API Key Isolation

- All API keys and secrets in `runtimeConfig` (not `runtimeConfig.public`)
- Meta App ID/Secret, TikTok keys, encryption key, Telegram bot token: server-only
- `NUXT_SUPABASE_KEY` (anon key) is the only key exposed to client
- `SUPABASE_SERVICE_ROLE_KEY` never exposed to client — used in cron jobs only

## Rate Limiting

- Instagram Graph API: 200 calls/user/hour — implement backoff
- Apply `nuxt-security` module for app-level rate limiting
- CORS restricted to own domain

## Input Validation

- All POST/PUT/PATCH bodies validated with Zod before processing
- Query params validated with Zod for directory search/filter endpoints
- File uploads: validate type and size before processing
- Telegram webhook: verify bot token in webhook URL

If a security issue is found: STOP, use security-reviewer agent, fix CRITICAL issues before continuing.
