# localgeist — Project Plan

## Overview

localgeist is a local-first fork of [Sitegeist](https://github.com/badlogic/sitegeist). All cloud API integrations have been stripped. The extension works with locally running LLM models (llama.cpp, Ollama, LM Studio, vLLM) via custom providers.

**Naming:** The project name is `localgeist` (all lowercase) in documentation, UI text, and filenames. Capitalized forms (`Localgeist`) only appear where code convention requires it (class names, function names).

## Completed

- Fork comparison & merge from 8 forks into localgeist
- `pi-mono` → `pi` dependency migration (`@earendil-works/pi-*` packages)
- All cloud integrations stripped (OAuth, API key dialogs, update checks, deployment code)
- Local model support via custom providers (Ollama, llama.cpp, vLLM, LM Studio)
- Hybrid script cancellation for `browserjs()` (cooperative flag + V8 terminate backup)
- 83 TypeScript errors fixed (Agent API method replacements, TypeBox 1.x migration)
- Gmail automation skill integrated
- Security audit (`npm audit fix --force`) — zero vulnerabilities
- Navigation tool `prepareArguments` fix (removed broken transformation)
- `prepareArguments` added to all tools for model compatibility
- Storage migration for `debuggerMode`/`showJsonMode` to settings store
- Dead code removal (`ContinueMessage`, `custom-messages.ts`, `appendAgentMessage`)
- Custom provider key resolution fixes
- Node builtin alias shim for esbuild
- Tool return type standardization to `AgentToolResult<T>`
- Live-reload guard for dev builds only
- Brave browser compatibility (Mojo/PageHandler stubs)
- Init error boundary with `showError()` fallback
- In-page session switching (no reload)
- Attachment handling in message transformer
- Migrated to `agent.steer()` for navigation messages
- Session list delete confirmation, keyboard shortcut fix, tutorial pill title update
- Renamed project to localgeist (all references, UI, manifests, code, docs)
- Archived `site/` directory (marketing site no longer needed)

## Archive site/

The `site/` directory (marketing site) is no longer needed. Project will be hosted on GitHub only.

**Files to archive:**
- `site/` — entire directory (src, infra, config, scripts)
- `site/run.sh` — deploy script
- `scripts/dev-server.mjs` — local dev server for site

**Cleanup:**
- Remove `cd site && npm run check` from `package.json` `check` script
- Remove site references from `package.json` `dev` script
- Remove `site/dist/` from `.gitignore`
- Update `AGENTS.md` project structure if referenced

## Prioritize Local Models in UI

Make local/custom providers the default and primary focus of the extension.

**Scope:**
- Model selector: show local providers first, cloud providers in collapsed section
- Settings: custom providers tab prominent, cloud providers secondary or hidden
- Welcome/setup flow: guide toward local model setup, not cloud API keys
- Consider removing cloud provider list entirely if no cloud keys are configured

**Approach:**
- Filter `ModelSelector` to show only local providers by default
- Add toggle or collapsed section for cloud providers
- May require wrapping or extending pi-web-ui's `ModelSelector` component
- Related to "Cloud Providers List Too Long" known issue

## Deferred

### REPL Safeguards

`buildWrapperCode()` accepts an `enableSafeguards` parameter (always `false`) with a placeholder comment. No implementation exists. Not a priority.

### Persistent Storage Request

`PersistentStorageDialog.request()` is commented out in `sidepanel.ts`. Only needed if users hit storage limits.

### Promise Wrapping for Script Cancellation

The hja branch includes a Promise constructor wrapper that makes every `await` a cancellation checkpoint. This was removed because it broke `new Promise()` in page contexts. Re-implementing with a safer approach (namespaced wrapper, or restoring original Promise more carefully) would make cancellation automatic rather than requiring explicit `__localgeist_yield()` calls.

See `archive/SCRIPT_CANCELLATION.md` for detailed analysis.

### `executionMode` on Tools

The `AgentTool` interface supports `executionMode?: "sequential" | "parallel"` for per-tool override. Currently all tools use the Agent-level default (`toolExecution: "sequential"`). With a single LLM backend, parallel execution provides no benefit.

See `DEFERRED.md` for details.

## Tutorial Pills → Skills Integration

**Future plan:** Link tutorial pills to skills — pills should trigger saved skills rather than ad-hoc prompts. This will be a localgeist-specific feature.

## CORS Proxy Notes

The proxy setting (`proxy.enabled`, `proxy.url`) is only used for:
- OAuth token refresh (cloud provider subscriptions)
- `extract_document` tool fetching web content

For local models (localhost), no proxy is needed. The extension has `http://localhost/*` and `http://127.0.0.1/*` in `host_permissions`.
