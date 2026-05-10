# PLAN-AUDIT — Audit nohupwork-localgeist/ for outdated pi/ API usage

## Goal

Systematically find patterns in nohupwork-localgeist/ that use deprecated, non-idiomatic, or outdated pi/ APIs and update them to match current best practices.

## Context

After the `pi-mono` → `pi` migration, the codebase typechecks and builds. The core `Agent` class is unchanged. The changes in pi are:

- **pi-agent-core** — `AgentHarness` refactored with generics (TSkill, TPromptTemplate, TTool), `factory.ts` removed, `setResources()` now emits `resources_update` event, `getResources()` added. Localgeist does NOT use `AgentHarness` — it uses `Agent` directly.
- **pi-web-ui** — Identical source between pi-mono and pi (no changes).
- **pi-ai** — Only generated model lists differ (data, not API).
- **mini-lit** — Separate repo, not rebranded.

So the audit focuses on **non-idiomatic usage patterns** rather than breakage.

---

## Completed

### #1. Tool `execute()` return types — FIXED (892b40b)

All tools now use explicit `AgentToolResult<T>` return types and `AgentToolUpdateCallback<T>` for `_onUpdate` params.

**Also fixed:** subscribe callback typing in sidepanel.ts (missing event param).

---

### #4. Subscribe callback typing — FIXED (892b40b)

`agent.subscribe(() => {...})` → `agent.subscribe((_event: AgentEvent) => {...})`.

---

## Audit Areas

### 2. Direct `state.messages` assignment

**Issue:** `state.messages` is assigned directly in 2 places. This bypasses any validation or reactivity the Agent might provide.

**Locations:**

| File | Line | Pattern |
|---|---|---|
| `WelcomeMessage.ts` | 58 | `this.agent.state.messages = messages;` |
| `sidepanel.ts` | 368 | `targetAgent.state.messages = targetAgent.state.messages.slice();` |

**Current API:** `agent.steer(msg)` for steering messages, `agent.followUp(msg)` for follow-ups. Direct assignment is used for session loading/reloading which is a bulk operation — `steer()`/`followUp()` are for individual messages.

**Risk:** Low — bulk assignment during session restore is likely the intended pattern. Verify with pi/ source.

---

### 3. Direct `chrome.storage.local` access

**Issue:** `debuggerMode` and `showJsonMode` use `chrome.storage.local` directly instead of `storage.settings` (IndexedDB). All other settings (`proxy.enabled`, `proxy.url`, `lastUsedModel`) use the settings store.

**Locations:**

| File | Key | Operation |
|---|---|---|
| `sidepanel.ts:390` | `debuggerMode` | Read |
| `sidepanel.ts:1036` | `showJsonMode` | Read |
| `debug.ts:70-81` | `debuggerMode`, `showJsonMode` | Read + Write (toggle) |

**Note:** `background.ts` uses `chrome.storage.session` for sidepanel state and session locks — this is correct (session storage is ephemeral, appropriate for UI state).

**Fix:** Migrate both keys to `storage.settings.get()`/`storage.settings.set()` for consistency.

**Risk:** Low — works fine as-is, purely organizational. Deferred.

---

### 5. `as any` casts

**Issue:** TypeScript contravariance with `AgentTool` requires some `as any` casts. Verify these are still necessary with current types.

```bash
grep -rn "as any" src/tools/ --include="*.ts"
```

**Risk:** Low — accepted limitation per AGENTS.md.

---

### 6. Missing `executionMode` on tools

**Issue:** The `AgentTool` interface now supports `executionMode?: "sequential" | "parallel"` for per-tool override. None of our tools set this.

**Check:**
```bash
grep -rn "executionMode" src/tools/ --include="*.ts"
```

**Risk:** Low — uses Agent-level default (`toolExecution: "sequential"`). Could be optimized if some tools are safe to run in parallel.

---

### 7. Event handling completeness

**Issue:** New event type `resources_update` exists in pi but is not handled.

**Current events handled in sidepanel.ts:**
- `message_end` — refresh messages
- `agent_end` — re-render after idle

**New events in pi:**
- `resources_update` — emitted when `setResources()` is called (not used by Localgeist since it doesn't use AgentHarness)

**Risk:** None — irrelevant without AgentHarness usage.

---

### 8. Build config `node:*` externals

**Issue:** `scripts/build.mjs` marks `node:*` builtins as external because pi-agent-core bundles server-side code (session storage, shell utils). This is a workaround, not an ideal solution.

**Locations:**
- `scripts/build.mjs` — `external: ["node:fs", "node:crypto", ...]`

**Risk:** Medium — if Localgeist ever imports from the server-side modules, the externals will cause runtime errors. Acceptable for now since those modules are never reached.

**Future:** If pi splits browser/server builds, remove externals.

---

### 9. `prepareArguments` on tools

**Issue:** AgentTool now supports optional `prepareArguments?: (args: unknown) => Static<TParameters>` for pre-validation arg transformation. None of our tools use this.

**Check:**
```bash
grep -rn "prepareArguments" src/tools/ --include="*.ts"
```

**Risk:** None — nice-to-have for arg compatibility shims.

---

### 10. Message transformer completeness — REVIEWED

**Fixed (f63b50e):** Added `timestamp: Date.now()` to `NavigationMessage` at creation time, matching `UserMessage`/`ToolResultMessage` pattern. Transformer now passes `timestamp: nav.timestamp` during conversion.

**Remaining TBD:** Dead `continue` type in `custom-messages.ts` — defined but never instantiated. Discuss before removal.

**Comparison of `browserMessageTransformer` vs pi-web-ui `defaultConvertToLlm`:**

| Role | pi-web-ui | Localgeist | Notes |
|---|---|---|---|
| `artifact` | Filtered out | Filtered out | ✓ |
| `welcome` | N/A | Filtered out | Localgeist-specific, correct |
| `user-with-attachments` | Converted to user + content blocks | Same | ✓ |
| `user`, `assistant`, `toolResult` | Pass-through | Pass-through | ✓ |
| `navigation` | N/A | Converted to user with `<browser-context>` XML | Extension-specific, correct |
| `continue` | N/A | Filtered out (never created) | Dead type |
| Everything else | Filtered out | Filtered out | ✓ |

**Post-process:** `reorderMessages()` keeps tool results adjacent to their tool calls, even when navigation messages (converted to user messages) appear between them. Extension-specific, correct.

**Findings:**

- **No missing message types** — all current `Message` types handled correctly.
- **`continue` is a dead type** — defined in `custom-messages.ts` but never instantiated anywhere. No renderer, no handler. **TBD: remove or keep for future use?**
- **Navigation message missing `timestamp`** — the `navigation` → user conversion doesn't set `timestamp` on the output message, while the `user-with-attachments` branch does (`timestamp: m.timestamp`). The pass-through branch preserves it naturally. The `NavigationMessage` type has a `timestamp` field. **TBD: add `timestamp` to navigation conversion, or discuss why it was omitted?**

---

### 11. Custom provider handling — TBD: investigate root cause

**Issue:** `getApiKey()` in `sidepanel.ts` checks `storage.providerKeys.get(provider)` first (cloud providers), then falls back to `storage.customProviders.getAll()` for custom/local providers. In practice, step 2 fails to find custom providers, requiring users to enter a dummy API key so step 1 matches instead.

**Workaround:** Enter any dummy value in the API Key field when setting up a local provider (documented in `known-issues.md`).

**`getApiKey` flow:**
```ts
getApiKey: async (provider: string) => {
    // 1. Cloud provider keys
    const stored = await storage.providerKeys.get(provider);
    if (stored) return resolveApiKey(stored, provider, storage.providerKeys, proxyUrl);

    // 2. Custom/local providers — FAILS HERE
    const customProviders = await storage.customProviders.getAll();
    const custom = customProviders.find((p) => p.name === provider);
    if (custom) return custom.apiKey || "";

    return undefined; // → "No API key for provider" error
}
```

**Suspected root causes (to investigate):**
- **Timing issue** — `customProviders.getAll()` may return empty on first call before store initialization completes
- **Name mismatch** — custom provider `name` field may not match the `provider` string (e.g., `"llama-server"` vs `"llama.cpp"`)
- **Provider name format** — `provider` string may include extra qualifiers

**Investigation needed:**
- Check what `storage.customProviders.getAll()` actually returns at runtime
- Compare `p.name` values against the `provider` string passed to `getApiKey()`
- Check `CustomProvidersStore` implementation in pi-web-ui
- Check if `resolveApiKey` in pi-agent-core has changed behavior

---

### 12. Module augmentation declarations

**Issue:** `declare module "@earendil-works/pi-agent-core"` and `declare module "@earendil-works/pi-web-ui"` are used to extend types. Verify these still compile cleanly and don't conflict with new types.

**Locations:**
- `messages/NavigationMessage.ts` — augments `pi-agent-core`
- `messages/WelcomeMessage.ts` — augments `pi-agent-core`
- `messages/custom-messages.ts` — augments `pi-agent-core`

**Risk:** Low — typechecks pass, but verify no shadowing of new types.

---

### 13. `ThinkingLevelSelectEvent` handling

**Issue:** pi-agent-core now has `ThinkingLevelSelectEvent` as a new event type. Check if Localgeist needs to handle it.

**Check:**
```bash
grep -rn "ThinkingLevelSelectEvent\|thinking_level" src/ --include="*.ts"
```

**Risk:** Low — likely handled by pi-web-ui's ChatPanel internally.

---

### 14. Skill loading patterns

**Issue:** `loadSourcedSkills` now accepts a `mapSkill` callback for custom skill types. Check if Localgeist's skill loading could benefit from this.

**Check:**
```bash
grep -rn "loadSourcedSkills\|loadSkill\|Skill" src/tools/skill.ts | head -20
```

**Risk:** Low — current pattern works, new callback is optional.

---

### 15. `terminate` flag on tool results

**Issue:** `AgentToolResult` has optional `terminate?: boolean` for early batch termination. Check if any tools should use this.

**Check:**
```bash
grep -rn "terminate" src/tools/ --include="*.ts"
```

**Risk:** Low — nice-to-have for tool control flow.

---

## Priority

| Priority | Area | Reason |
|---|---|---|
| **Done** | #1 Tool return types | Fixed (892b40b) |
| **Done** | #4 Subscribe typing | Fixed (892b40b) |
| **Done** | #10 Message transformer | Reviewed, no issues. Two TBDs: dead `continue` type, missing `timestamp` on navigation conversion |
| **Medium** | #3 chrome.storage.local | Inconsistency with stores |
| **Medium** | #11 Custom provider handling | User-facing workaround |
| **Low** | #2 state.messages assignment | Bulk operation, likely correct |
| **Low** | #5 as any casts | Accepted limitation |
| **Low** | #6 executionMode | Optimization, not correctness |
| **Low** | #7 Event completeness | Irrelevant without AgentHarness |
| **Low** | #8 Build externals | Workaround, document risk |
| **Low** | #9 prepareArguments | Nice-to-have |
| **Low** | #12 Module augmentation | Typechecks pass |
| **Low** | #13 ThinkingLevelSelectEvent | Handled by ChatPanel |
| **Low** | #14 Skill loading | Current pattern works |
| **Low** | #15 terminate flag | Nice-to-have |

## Execution

For each finding:
1. Document the outdated pattern and its location
2. Identify the current pi/ equivalent
3. Assess risk (breaking change? behavior change?)
4. Implement fix, typecheck, build, test
5. Commit with clear message referencing the audit

## Scope

- **In scope:** `src/` directory (TypeScript source), `scripts/build.mjs` (build config)
- **Out of scope:** `static/` (HTML/JS/CSS), `site/` (website), `archive/` (archived files)
