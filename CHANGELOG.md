# Changelog

## [Unreleased]

### Breaking Changes

- Migrated pi dependencies from `@mariozechner/pi-*` (pi-mono) to `@earendil-works/pi-*` (pi). Requires `../pi` sibling repo.

### Removed

- All deployment infrastructure: `publish.sh`, `release.sh`, `.github/workflows/build.yml`, external server references
- Update check mechanism and `UpdateNotificationDialog`
- `ApiKeyOrOAuthDialog`, `ApiKeysOAuthTab` (moved to `archive/`)
- Dead types: `ContinueMessage`, `custom-messages.ts`, `appendAgentMessage` helper
- Debug logging from `getApiKey()`

### Changed

- Renamed project to localgeist (all references, UI, manifests, code)
- `@tailwindcss/cli` upgraded from `^4.0.0-beta.14` to `^4.2.0` (stable release)
- `AboutTab` replaced with minimal placeholder
- Replaced `@sinclair/typebox` 0.34.x with `typebox` 1.x
- Standardized tool `execute()` return types to `AgentToolResult<T>`
- Added timestamps to `NavigationMessage`, matching other message types
- Migrated `debuggerMode` and `showJsonMode` from `chrome.storage.local` to settings store
- Replaced esbuild `external` with alias shim for `node:*` builtins
- Live-reload script guarded to dev builds only
- Navigation messages use `agent.steer()` instead of direct `state.messages.push()`
- Post-agent-end re-render uses `waitForIdle()` to prevent blank screen

### Added

- Gmail automation skill: 15 functions for composing, reading, replying, searching, and managing emails on `mail.google.com`
- Local model support: `ProvidersModelsTab` from pi-web-ui — Ollama, llama.cpp, vLLM, LM Studio discovery
- Hybrid script cancellation for `browserjs()` — `__localgeist_yield()` helper + V8 `terminate()` backup, 30s timeout
- `prepareArguments()` on all tools for model-specific argument normalization
- In-page session switching (no reload) with session lock management
- Init error boundary with `showError()` fallback UI
- User message attachment handling in message transformer
- Brave browser compatibility (Mojo/PageHandler stubs)
- Keyboard shortcut fallback to last focused window
- `CREDITS.md` acknowledging upstream contributors
- `DEFERRED.md` documenting intentionally deferred items
- `known-issues.md` tracking active bugs
- `SCRIPT_CANCELLATION.md` documenting cooperative cancellation approach

### Fixed

- 83 TypeScript errors: Agent API method replacements (`setModel`, `appendMessage`, `replaceMessages`), added `onUpdate` to tool `execute` methods
- Added `@customElement` decorators to settings tabs (Lit requirement)
- ModelSelector includes custom/local providers in selection
- `getApiKey`, `hasAnyApiKey`, `getProvidersWithKeys` include custom providers
- Custom provider key resolution: matches on provider `type` instead of `baseUrl`
- Navigate tool: removed broken `prepareArguments` transformation wrapping `{ url }` into `{ navigate: { url } }`
- Removed broken Promise constructor wrapping from browserjs()
- Post-agent-end blank screen (edgyarmati fix)
- Visibility re-render when sidepanel becomes visible (Chrome throttling)

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
