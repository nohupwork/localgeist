# Sitegeist — Local Development Notes

## What We Did

Merged PR from `origin/hja` (commit `c2a47b6`) — hybrid script cancellation for `browserjs()`. Promise wrapping removed (broke `new Promise()`), kept `__sitegeist_yield()` + V8 terminate backup.

**Files changed:**
- `SCRIPT_CANCELLATION.md` — documentation of the cooperative cancellation approach
- `src/prompts/prompts.ts` — added `__sitegeist_yield()` docs to system prompt
- `src/tools/repl/runtime-providers.ts` — hybrid abort handler (cooperative flag + V8 terminate backup)
- `src/tools/repl/userscripts-helpers.ts` — `__sitegeist_yield()` helper, timeout 30s (Promise wrapping removed)

**Status: tested.** Local models (llama.cpp) work. Known issues documented in `known-issues.md`.

Original files preserved in `archive/`.

## Deployment Code — Stripped

All external server calls and GitHub deployment code has been removed:
- `publish.sh`, `release.sh`, `.github/workflows/build.yml` — deleted
- `UpdateNotificationDialog.ts` — deleted
- `checkForUpdates()` + `isNewerVersion()` from `sidepanel.ts` — removed
- `AboutTab.ts` — replaced with minimal placeholder
- `site/run.sh` — deploy case removed
- Tutorial proxy references — removed
- `ApiKeysOAuthTab.ts` — moved to `archive/` (replaced by `ProvidersModelsTab` from `pi-web-ui`)

## Changelog

Location: `CHANGELOG.md` (original: `archive/CHANGELOG-original.md`)

After every code change, add an entry under `## [Unreleased]`. Format:
- Sections: `### Added`, `### Changed`, `### Fixed`, `### Removed`
- Latest entry always goes at the **top** of its subsection
- Never modify already-released version sections

## Code TODOs (documented, not yet fixed)

| Location | Issue | Status |
|----------|-------|--------|
| `sidepanel.ts:923` | `PersistentStorageDialog.request()` — request more storage quota | Commented out, keep as-is |
| `userscripts-helpers.ts:335` | `enableSafeguards` parameter exists but not implemented | Placeholder, not a priority |
| `sidepanel.ts:getApiKey` | Custom provider keys not found correctly, requires dummy API key workaround | Debug logging added, needs investigation |

## Known Issues

See `known-issues.md` for detailed documentation of:
- Dummy API key requirement for local providers
- Chat output flash/collapse UI bug
- Context size showing default values
- Cloud providers list too long

## CORS Proxy Notes

The proxy setting is only used for OAuth token refresh and `extract_document` tool. For local models (localhost), no proxy is needed — the extension has `http://localhost/*` and `http://127.0.0.1/*` in `host_permissions`.

## Building and Running

Requires sibling repos at same level:

```
parent/
  mini-lit/
  pi-mono/
  sitegeist/
```

### First-time setup

Install and build all three (siblings first, then sitegeist):

```bash
cd mini-lit  && npm install && npm run build
cd ../pi-mono && npm install && npm run build
cd ../sitegeist && npm install && npm run build
```

### Day-to-day

```bash
./dev.sh          # all watchers (mini-lit, pi-mono, sitegeist, site)
npm run dev       # sitegeist extension watcher only
npm run build     # production build -> dist-chrome/
npx tsc --noEmit  # typecheck (pre-existing errors expected, see below)
```

### Dependencies

After updating dependencies, run `npm audit fix --force` in all three directories, then rebuild all three. This is safe — all fixes are minor-version bumps (backward-compatible by semver).

### Typecheck

`npx tsc --noEmit` passes clean. 7 tool instances use `as any` casts due to TypeScript contravariance (tools accept typed params, `AgentTool<any,any>` expects `unknown`). Safe at runtime — params validated by TypeBox schemas before `execute` is called.

Load `dist-chrome/` as unpacked extension in Chrome/Edge. Enable "Allow user scripts" in extension details.

## Project Structure

```
src/
  sidepanel.ts          # Main entry point, agent setup, settings, rendering
  background.ts         # Service worker (sidepanel toggle, session locks)
  oauth/                # Browser OAuth flows (Anthropic, OpenAI, GitHub, Gemini)
  dialogs/              # Settings tabs, API key dialogs, welcome setup
  tools/                # Agent tools (navigate, REPL, extract-image, skills, debugger)
  messages/             # Custom message types (navigation, welcome)
  storage/              # IndexedDB storage (sessions, skills, costs)
  prompts/              # System prompt and token counting
  components/           # UI components (Toast, TabPill, OrbAnimation)
static/
  manifest.chrome.json  # Extension manifest (version lives here)
  cors-rules.json       # declarativeNetRequest CORS rules for OAuth
site/
  src/frontend/         # Static landing page and install instructions
```
