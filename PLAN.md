# Localgeist — Project Plan

## Overview

Localgeist is a local-first fork of [Sitegeist](https://github.com/badlogic/sitegeist). All cloud API integrations have been stripped. The extension works with locally running LLM models (llama.cpp, Ollama, LM Studio, vLLM) via custom providers.

## Completed

- Fork comparison & merge from 8 forks into Localgeist
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

## Known Issues

### Model Selection Resets on New Chat

**Symptom:** Starting a new chat resets the model selector, opening the Settings page with provider options instead of restoring the previously selected local model.

**Suspected cause:** `lastUsedModel` persistence may be affected by the settings store migration. Custom providers may not be loaded when model is restored.

**Reproduction:** Select a local provider model, start a new chat → Settings page opens.

### Cloud Providers List Too Long

**Symptom:** The model selector shows a long list of cloud providers (Anthropic, OpenAI, Google, Groq, OpenRouter, Vercel, Cerebras, xAI, Z-AI, etc.).

**Status:** Documented for later cleanup. Consider shortening, hiding, or removing cloud providers since local models are the primary use case.

### Context Size Shows Default Values

**Symptom:** llama.cpp models show "8k/4k" for context/max tokens instead of actual values (e.g., 262k for Qwen3.6-27B).

**Cause:** pi-web-ui's `discoverLlamaCppModels()` only checks `model.context_length` which is not present in llama.cpp's `/v1/models` response. The actual value is in `meta.n_ctx_train`.

**Status:** Upstream pi-web-ui bug. Not fixable in Localgeist without modifying `../pi`.

## Deferred

### REPL Safeguards

`buildWrapperCode()` accepts an `enableSafeguards` parameter (always `false`) with a placeholder comment. No implementation exists. Not a priority.

### Persistent Storage Request

`PersistentStorageDialog.request()` is commented out in `sidepanel.ts`. Only needed if users hit storage limits.

### Promise Wrapping for Script Cancellation

The hja branch includes a Promise constructor wrapper that makes every `await` a cancellation checkpoint. This was removed because it broke `new Promise()` in page contexts. Re-implementing with a safer approach (namespaced wrapper, or restoring original Promise more carefully) would make cancellation automatic rather than requiring explicit `__sitegeist_yield()` calls.

See `SCRIPT_CANCELLATION.md` for detailed analysis.

### `executionMode` on Tools

The `AgentTool` interface supports `executionMode?: "sequential" | "parallel"` for per-tool override. Currently all tools use the Agent-level default (`toolExecution: "sequential"`). With a single LLM backend, parallel execution provides no benefit.

See `DEFERRED.md` for details.

## Tutorial Pills → Skills Integration

**Future plan:** Link tutorial pills to skills — pills should trigger saved skills rather than ad-hoc prompts. This will be a Localgeist-specific feature.

## CORS Proxy Notes

The proxy setting (`proxy.enabled`, `proxy.url`) is only used for:
- OAuth token refresh (cloud provider subscriptions)
- `extract_document` tool fetching web content

For local models (localhost), no proxy is needed. The extension has `http://localhost/*` and `http://127.0.0.1/*` in `host_permissions`.
