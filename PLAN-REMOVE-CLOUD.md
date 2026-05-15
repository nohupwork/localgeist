# Remove Cloud Providers

## Goal

Remove all cloud provider support. localgeist is local-first — only custom/local providers (Ollama, llama.cpp, vLLM, LM Studio, OpenAI-compatible).

## Phase 1: Settings Tab

Replace `ProvidersModelsTab` (upstream, shows cloud + custom) with local `CustomProvidersTab` (custom only).

**New file:** `src/dialogs/CustomProvidersTab.ts`
- Extract `renderCustomProviders()` logic from upstream `ProvidersModelsTab`
- Extend `SettingsTab` from pi-web-ui
- Tab name: "Providers" (no "Models" suffix, simpler)
- Same add/edit/delete/refresh functionality for custom providers

**File:** `src/sidepanel.ts`
- Replace `import { ProvidersModelsTab }` with `import { CustomProvidersTab }`
- Replace all `new ProvidersModelsTab()` with `new CustomProvidersTab()`

## Phase 2: sidepanel.ts Cleanup

**Remove:**
- `DEFAULT_MODELS` constant (cloud provider default model mapping)
- `getModels` import from `@earendil-works/pi-ai` (only used for cloud)
- `isOAuthCredentials` import from `./oauth/index.js`
- `resolveApiKey` import from `./oauth/index.js`

**Simplify:**
- `getProvidersWithKeys()` — remove cloud `providerKeys.list()` loop, only return custom provider names
- `hasAnyApiKey()` — only check custom providers
- `selectDefaultModelForAvailableProvider()` — remove `DEFAULT_MODELS` lookup, pick first model from first custom provider
- `updateAuthLabel()` — remove OAuth credentials branch, only handle plain API keys and custom providers

## Phase 3: Archive OAuth

Move `src/oauth/` to `archive/oauth/` — cloud-only code (Anthropic, OpenAI, GitHub Copilot, Google Gemini OAuth flows).

**Files to archive:**
- `src/oauth/index.ts`
- `src/oauth/types.ts`
- `src/oauth/browser-oauth.ts`
- `src/oauth/anthropic.ts`
- `src/oauth/openai-codex.ts`
- `src/oauth/github-copilot.ts`
- `src/oauth/google-gemini-cli.ts`

**Update imports:** Nothing in remaining code should reference `./oauth/` after Phase 2.

## Phase 4: Welcome Dialog

**File:** `src/dialogs/WelcomeSetupDialog.ts`
- Remove "API Keys & OAuth" reference from comment
- Simplify text: remove mention of cloud API keys, focus on local models
- Verify `openApiKeysDialog()` still works (opens Providers tab with custom providers)

## Phase 5: Documentation

**File:** `README.md`
- Remove "Bring your own API key or log in with an existing subscription" paragraph
- Update first-run instructions to focus on local models

**File:** `simple-install.md`
- Already mostly local-focused, verify no cloud references remain

**File:** `CHANGELOG.md`
- Add entry under `### Removed`: `Cloud provider support (OAuth, API key dialogs, cloud model list)`
- Add entry under `### Changed`: `Settings Providers tab shows only custom/local providers`

**File:** `PLAN.md`
- Add to Completed: `Removed cloud providers, local-only (Ollama, llama.cpp, vLLM, LM Studio)`

## Execution Order

1. Phase 1 (Settings Tab) — create CustomProvidersTab, verify settings dialog works
2. Phase 2 (sidepanel.ts Cleanup) — simplify functions, remove cloud imports
3. Phase 3 (Archive OAuth) — move directory, verify no broken imports
4. Phase 4 (Welcome Dialog) — update text
5. Phase 5 (Documentation) — update README, CHANGELOG, PLAN

## Pain Points

1. **CustomProvidersTab:** Must replicate upstream `ProvidersModelsTab` custom providers logic. If upstream changes, we diverge. Acceptable trade-off for local-only focus.
2. **ModelSelector:** Upstream component still calls `getProviders()` internally. With no cloud keys configured, cloud models won't appear. No change needed unless we want to remove the cloud section from the selector UI too.
3. **`resolveApiKey`:** Used in `updateAuthLabel()` to resolve OAuth tokens. After removal, only plain string keys and custom providers remain.

## Verification

After each phase:
- `npm run check` — typecheck + lint
- `npm run build` — verify build succeeds
- `grep -rn "oauth\|OAuth\|getProviders\|DEFAULT_MODELS" src/` — verify no unexpected references remain
