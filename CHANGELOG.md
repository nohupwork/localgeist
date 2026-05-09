# Changelog

## [Unreleased]

### Removed

- `README.md` references to external servers: download links (`sitegeist.ai`), CORS proxy (`proxy.mariozechner.at`), website deploy instructions, release instructions
- Deployment infrastructure: `publish.sh`, `release.sh`, `.github/workflows/build.yml`
- Update check mechanism: `checkForUpdates()` function, `UpdateNotificationDialog`, `isNewerVersion()` helper — extension no longer contacts `sitegeist.ai` for version checks
- `UpdateNotificationDialog.ts` — no longer used
- Deploy case from `site/run.sh` — SSH/rsync to external server removed
- CORS proxy references from tutorial text
- External telemetry: all calls to `sitegeist.ai` and `proxy.mariozechner.at` removed

### Changed

- `@tailwindcss/cli` upgraded from `^4.0.0-beta.14` to `^4.2.0` (stable release)
- `AboutTab` replaced with minimal placeholder (removed website links and update check)
- Added `typescript` as explicit dev dependency for `npm run typecheck`
- Fixed TypeScript errors: replaced removed Agent API methods (`setModel` → `state.model`, `appendMessage` → `state.messages.push`, `replaceMessages` → `state.messages =`), added `onUpdate` parameter to tool `execute` methods, cast tool instances for `AgentTool` contravariance (tools accept typed params, interface expects `unknown`), cleaned up unused `@ts-expect-error` directives in cancellation code
- Replaced `@sinclair/typebox` 0.34.x with `typebox` 1.x (package rename) to align with `pi-mono`
- Verified all imports from `pi-mono` (pi-agent-core, pi-ai, pi-web-ui) and `mini-lit` are compatible with latest versions

### Added

- Gmail automation skill: integrated `gmail.md` into `default-skills.ts` — 15 functions for composing, reading, replying, searching, and managing emails on `mail.google.com`
- Local model support: replaced `ApiKeysOAuthTab` with `ProvidersModelsTab` from `pi-web-ui` — Ollama, llama.cpp (port 8080), vLLM, LM Studio discovery now available in settings
- Hybrid script cancellation for `browserjs()` — `__sitegeist_yield()` helper + V8 `terminate()` backup (PR `c2a47b6`). Promise wrapping removed (broke page contexts). Timeout reduced from 120s to 30s.
- `SCRIPT_CANCELLATION.md` — documentation of the cooperative cancellation approach

### Fixed

- Added `@customElement` decorators to `AboutTab`, `SkillsTab`, `CostsTab` — required by Lit for classes extending `SettingsTab`/`LitElement`, prevents "Illegal constructor" runtime error
- Removed `ApiKeyOrOAuthDialog` from `onApiKeyRequired` callback — now opens settings dialog so local providers can be configured
- Moved unused `ApiKeyOrOAuthDialog.ts` to `archive/`
- ModelSelector now includes custom/local providers in model selection (was filtered out by `allowedProviders` check)
- `getApiKey` now checks custom providers for API keys, returns empty string for local types (llama.cpp, Ollama, etc.)
- `hasAnyApiKey` and `getProvidersWithKeys` now include custom/local providers (fixes new chat asking for provider setup)
- Removed broken Promise constructor wrapping from browserjs() that caused "Promise is not a constructor" errors

## [1.0.0] - 2026-03-15

### Added

- Browser-based OAuth login for Anthropic (Claude Pro/Max), OpenAI Codex (ChatGPT Plus/Pro), GitHub Copilot, and Google Gemini CLI
- Combined "API Keys & OAuth" settings tab with subscription login and API key entry
- Welcome setup dialog on first launch when no providers are configured
- Auto-select default model for the first provider with a key
- Provider and auth type indicator in the header bar
- Image extraction tool (`extract_image`) with selector and screenshot modes
- Subsequence-based fuzzy search in the model selector
- CORS proxy warning in OAuth sections (orange when enabled, red when disabled)
- GitHub Actions workflow for tagged releases
- `release.sh` script for version bumping and tagged releases

### Changed

- Default model changed to `claude-sonnet-4-6` with `medium` thinking level
- CORS proxy enabled by default
- Model selector only shows models from providers with configured keys
- API key prompt dialog now shows both OAuth login and API key entry for supported providers
- Tool execution set to sequential mode (parallel caused rendering issues in sidebar)
- Site converted to static (removed backend, admin, waitlist signups)
- Download links point to GitHub Releases
- License changed from MIT to AGPL-3.0

### Fixed

- Settings dialog tabs not responding to clicks (upstream `pi-web-ui` built with `tsgo` broke Lit decorator reactivity)
- CORS proxy toggle not updating (same root cause)
- Proxy not applied to API requests (esbuild bundled duplicate `streamSimple` references, breaking identity check)
- Model selector button not updating after picking a model (added `state_change` event to Agent)
- Duplicate tool component rendering during streaming (cleared streaming container on `message_end`)
- Screenshot tool capturing sidepanel instead of the webpage
