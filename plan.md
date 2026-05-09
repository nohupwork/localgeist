# Plan

## Completed

- Merged PR `origin/hja` (commit `c2a47b6`) — hybrid script cancellation for `browserjs()`
  - `SCRIPT_CANCELLATION.md` — documentation of the cooperative cancellation approach
  - `src/prompts/prompts.ts` — added `__sitegeist_yield()` docs to system prompt
  - `src/tools/repl/runtime-providers.ts` — hybrid abort handler (cooperative flag + V8 terminate backup)
  - `src/tools/repl/userscripts-helpers.ts` — Promise constructor wrapping **removed** (broke `new Promise()` in page contexts), kept `__sitegeist_yield()` helper + V8 terminate backup
  - **Status: tested** — local models work, browserjs() works without Promise wrapping
- Backed up originals: `AGENTS-original.md`, `plan-original.md`, `db-original.md`
- Fixed 83 TypeScript errors: Agent API method replacements (`setModel`, `appendMessage`, `replaceMessages`), added `onUpdate` to tool `execute` methods, replaced `@sinclair/typebox` with `typebox` 1.x, cleaned up `@ts-expect-error` directives
- Stripped all deployment code: `publish.sh`, `release.sh`, `.github/`, update check, `UpdateNotificationDialog`, proxy references
- Ran `npm audit fix --force` on all three repos — zero vulnerabilities

## Remaining Work

### 1. ~~Strip Deployment Code~~ — Done

Removed `publish.sh`, `release.sh`, `.github/workflows/build.yml`, `UpdateNotificationDialog.ts`, update check from `AboutTab.ts`, `checkForUpdates()` + `isNewerVersion()` from `sidepanel.ts`, deploy case from `site/run.sh`, proxy references from tutorial text.

**Build status:** `npm run build` succeeds. `npx tsc --noEmit` passes clean. All imports from `pi-mono` and `mini-lit` verified compatible with latest versions.

### 2. ~~Build and Test~~ — Done

All three repos install, build, and pass `npm audit fix --force` (zero vulnerabilities). Extension loads as unpacked from `dist-chrome/`.

### 3. ~~Local Model Support (llama.cpp / Ollama)~~ — Done

Replaced `ApiKeysOAuthTab` with `ProvidersModelsTab` in both `SettingsDialog.open()` calls. Removed `ApiKeysOAuthTab.ts` import (moved to `archive/`). Ollama, llama.cpp, vLLM, LM Studio discovery now available via the providers tab.

### 4. ~~Session Title Editing~~ — Done

Title editing works via Enter (save) / Escape (cancel). Removed commented-out `onBlur` block — `mini-lit` Input doesn't support it, and keyboard approach is sufficient.

### 5. Safeguards in REPL

`buildWrapperCode()` accepts an `enableSafeguards` parameter (always `false`) with a placeholder comment. No implementation exists. Documented but not a priority.

### 6. ~~Gmail Automation Skill~~ — Done

Integrated `gmail.md` into `default-skills.ts` as the `gmail` skill (domain: `mail.google.com`). Provides 15 functions for composing, reading, replying, searching, and managing emails.

### 7. Persistent Storage Request

`PersistentStorageDialog.request()` is commented out in `sidepanel.ts` (line 932). Keep commented out for now — only needed if users hit storage limits.

### 8. Cloud Providers List

The ModelSelector shows a long list of cloud providers (Anthropic, OpenAI, Google, Groq, OpenRouter, Vercel, Cerebras, xAI, Z-AI, etc.). Consider shortening, hiding, or removing this list later since local models are the primary use case.

### 9. Known Issues (documented in known-issues.md)

- **Dummy API key required for local providers** — `getApiKey` doesn't correctly find custom provider keys (debug logging added, needs investigation)
- **Chat output flashes then collapses** — UI rendering bug, likely in pi-web-ui chat panel (thinking/content block race condition)
- **Context size shows defaults** — pi-mono bug, llama.cpp discovery doesn't read `meta.n_ctx_train`

## Notes on CORS Proxy

The proxy setting (`proxy.enabled`, `proxy.url`) is only used for:
- OAuth token refresh (cloud provider subscriptions)
- `extract_document` tool fetching web content

For local models (llama.cpp, Ollama on localhost), no proxy is needed. The extension has `http://localhost/*` and `http://127.0.0.1/*` in `host_permissions`, so direct calls work without CORS issues. When local model support is implemented, the proxy can be removed or left as-is (it won't interfere).
