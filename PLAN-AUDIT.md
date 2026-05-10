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

### 2. Direct `state.messages` assignment — REVIEWED, no change needed

**Two usage patterns, both correct:**

| File | Purpose |
|---|---|
| `WelcomeMessage.ts` | Filter out welcome message, replace array (removal) |
| `sidepanel.ts` | Shallow copy reassignment (reactivity trigger for UI re-render) |

`steer()` and `followUp()` are add-only. No `removeMessage()` exists. The `state.messages` setter is the only bulk write API, designed for this (`nextMessages.slice()` on set).

---

### 3. Direct `chrome.storage.local` access — FIXED (780f192)

Migrated `debuggerMode` and `showJsonMode` to `storage.settings`. All settings now use the unified IndexedDB store.

---

### 5. `as any` casts — REVIEWED, no change

**17 total casts, all necessary. Two categories:**

1. **`window` custom properties** (14) — injecting functions into page context (`nativeClick`, `sendRuntimeMessage`, `__sitegeist_cancelled` etc.). Same pattern used in pi-web-ui itself (ArtifactsRuntimeProvider, FileDownloadRuntimeProvider, AttachmentsRuntimeProvider).
2. **Chrome API results** (3) — `chrome.userScripts.execute()` returns untyped results.

No types exist for runtime-injected globals. `as any` is the established pattern in both Localgeist and upstream pi.

---

### 6. Missing `executionMode` on tools — REVIEWED, defer

Agent-level default is `"sequential"`. Per-tool `executionMode` only matters if someone switches to parallel mode and wants selective sequential tools. With a single LLM backend, parallel execution provides no benefit. Defer until needed.

---

### 7. Event handling completeness — REVIEWED, no change

`resources_update` is emitted by `AgentHarness.setResources()`. Localgeist uses `Agent` directly (not `AgentHarness`), implementing its own skills/prompt system. Irrelevant without AgentHarness.

---

### 8. Build config `node:*` shim — REVIEWED, workaround in place

**Fixed (decf719):** pi-agent-core bundles server-side code (session storage, shell utils) with `node:*` imports. Esbuild `external` violated Chrome CSP, so switched to `alias` → `scripts/node-shim.js` (empty stubs). Works correctly; remove if pi ever splits browser/server builds.

---

### 9. `prepareArguments` on tools — FIXED (9b24a3a)

Added `prepareArguments` to all 6 tools for model compatibility. Normalizes common quirks before schema validation (descriptive action strings, nested objects, mode variants). Matches upstream pi pattern from coding-agent.

---

### 10. Message transformer completeness — REVIEWED

**Fixed (f63b50e):** Added `timestamp: Date.now()` to `NavigationMessage` at creation time, matching `UserMessage`/`ToolResultMessage` pattern. Transformer now passes `timestamp: nav.timestamp` during conversion.

**Remaining:** Dead `continue` type removed — see below.

**`ContinueMessage` removal rationale:** The `continue` message type was planned as a button-based way to resume LLM output (e.g. after truncation or mid-task). However, the user can already achieve identical results by typing "Please continue" as a normal prompt — the LLM sees full conversation history and continues naturally. A dedicated `continue` message type would be pure UX sugar with no functional benefit, requiring a UI button, message handling, and edge case logic for no gain. Removal was the better path.

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

### 11. Custom provider handling — FIXED

**Root cause:** `getApiKey()` only matched on `p.name`, missing cases where the model's provider string was set to `p.type`. Also returned empty string `""` for providers without keys, which pi-ai provider implementations reject as falsy.

**Fixes applied:**
- Match on `p.name || p.type` (aligns with `onApiKeyRequired` and how pi-web-ui constructs model provider strings)
- Return `"local"` placeholder instead of `""` for keyless providers
- Verified working with runtime debug logging

**Commits:** `3bd74ab`, `336974a`, `2705ee9`

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
| **Done** | #2 state.messages assignment | Reviewed, correct usage |
| **Done** | #3 chrome.storage.local | Fixed (780f192) |
| **Done** | #4 Subscribe typing | Fixed (892b40b) |
| **Done** | #10 Message transformer | Reviewed. Fixed timestamp (f63b50e). Removed dead `continue` type |
| **Done** | #11 Custom provider handling | Fixed (3bd74ab, 336974a, 2705ee9) |
| **Done** | #5 as any casts | Reviewed, necessary, matches upstream pi |
| **Done** | #6 executionMode | Reviewed, defer (sequential default is correct) |
| **Done** | #7 Event completeness | Reviewed, irrelevant without AgentHarness |
| **Done** | #8 Build shim | Reviewed, workaround in place (decf719) |
| **Done** | #9 prepareArguments | Fixed (9b24a3a) |
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
