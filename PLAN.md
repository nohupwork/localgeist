# Localgeist — Project Plan

## Overview

Localgeist is a local-first fork of [Sitegeist](https://github.com/badlogic/sitegeist). All cloud API integrations have been stripped. The extension works with locally running LLM models (llama.cpp, Ollama, LM Studio, vLLM) via custom providers.

## Completed

- Merged `origin/hja` (commit `c2a47b6`) — hybrid script cancellation for `browserjs()`
  - `SCRIPT_CANCELLATION.md` — documentation of the cooperative cancellation approach
  - `src/prompts/prompts.ts` — added `__sitegeist_yield()` docs to system prompt
  - `src/tools/repl/runtime-providers.ts` — hybrid abort handler (cooperative flag + V8 terminate backup)
  - `src/tools/repl/userscripts-helpers.ts` — `__sitegeist_yield()` helper, timeout 30s (Promise wrapping removed — broke `new Promise()` in page contexts)
  - **Status: tested** — local models work, browserjs() works
- Fixed 83 TypeScript errors — Agent API method replacements (`setModel`, `appendMessage`, `replaceMessages`), added `_onUpdate` to tool `execute` methods, replaced `@sinclair/typebox` with `typebox` 1.x
- Stripped all deployment code — `publish.sh`, `release.sh`, `.github/`, update check, `UpdateNotificationDialog`, proxy references
- Replaced `ApiKeysOAuthTab` with `ProvidersModelsTab` from `pi-web-ui` — Ollama, llama.cpp, vLLM, LM Studio discovery available
- Session title editing via Enter/Escape (removed commented-out `onBlur` block)
- Gmail automation skill integrated into `default-skills.ts`
- Ran `npm audit fix --force` on all three repos — zero vulnerabilities

## Remaining Work

### 1. Safeguards in REPL

`buildWrapperCode()` accepts an `enableSafeguards` parameter (always `false`) with a placeholder comment. No implementation exists. Documented but not a priority.

### 2. Persistent Storage Request

`PersistentStorageDialog.request()` is commented out in `sidepanel.ts`. Keep commented out for now — only needed if users hit storage limits.

### 3. Cloud Providers List

The ModelSelector shows a long list of cloud providers (Anthropic, OpenAI, Google, Groq, OpenRouter, Vercel, Cerebras, xAI, Z-AI, etc.). Consider shortening, hiding, or removing this list since local models are the primary use case.

### 4. Custom Provider Key Resolution

`getApiKey()` in `sidepanel.ts` does not correctly find custom provider keys. Currently requires a dummy API key as workaround (see `known-issues.md`). Needs investigation into how `storage.customProviders.getAll()` maps to the provider name passed by the agent.

### 5. Script Cancellation — Promise Wrapping

The hja branch includes a Promise constructor wrapper that makes every `await` a cancellation checkpoint. This was removed from Localgeist because it broke `new Promise()` in page contexts. Re-implementing with a safer approach (namespaced wrapper, or restoring original Promise more carefully) would make cancellation automatic rather than requiring explicit `__sitegeist_yield()` calls.

## Known Issues

See `known-issues.md` for detailed documentation:

| Issue | Location | Status |
|---|---|---|
| Dummy API key required for local providers | `sidepanel.ts:getApiKey` | Debug logging added, needs investigation |
| Chat output flashes then collapses | pi-web-ui chat panel | UI rendering bug, likely thinking/content block race condition |
| Context size shows defaults | pi-mono model discovery | llama.cpp discovery doesn't read `meta.n_ctx_train` |

## Custom Provider System

Custom providers are managed by `pi-web-ui`'s `ProvidersModelsTab`. Localgeist integrates them via:

- `storage.customProviders.getAll()` — fetch all configured providers
- `getProvidersWithKeys()` — includes custom providers alongside cloud ones
- `hasAnyApiKey()` — returns true if any custom provider exists
- `getApiKey()` — resolves API key for a provider (cloud first, then custom)
- `onApiKeyRequired()` — skips key prompt for known custom providers

### Auto-Discovery Types

| Type | Endpoint | API |
|---|---|---|
| Ollama | `GET /api/tags` | openai-completions |
| llama.cpp | `GET /v1/models` | openai-completions |
| vLLM | `GET /v1/models` | openai-completions |

Models are fetched on-demand (not stored). Provider config (name, type, baseUrl, apiKey) is persisted.

## CORS Proxy Notes

The proxy setting (`proxy.enabled`, `proxy.url`) is only used for:
- OAuth token refresh (cloud provider subscriptions)
- `extract_document` tool fetching web content

For local models (localhost), no proxy is needed. The extension has `http://localhost/*` and `http://127.0.0.1/*` in `host_permissions`.

## Archived Files

Original upstream files preserved in `archive/`:

| File | Description |
|---|---|
| `AGENTS-original.md` | Mario Zechner's original development rules |
| `AGENTS-mvp.md` | Localgeist MVP development notes |
| `plan-original.md` | Upstream Sitegeist providers & models plan |
| `plan-localgeist.md` | Localgeist task tracker (pre-merge) |
| `CHANGELOG-original.md` | Original changelog |
| `db-original.md` | Original database documentation |
| `ApiKeyOrOAuthDialog.ts` | Stripped cloud API key/OAuth dialog |
| `ApiKeysOAuthTab.ts` | Stripped cloud provider settings tab |
| `session-title-onBlur.ts` | Session title blur handler (not used) |
