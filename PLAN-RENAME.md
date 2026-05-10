# Rename sitegeist → localgeist

## Naming Convention

- `localgeist` (all lowercase) in documentation, UI text, filenames, manifest
- `Localgeist` only where code convention requires it (PascalCase class names)
- `localgeist*` (camelCase) for function names

## Keep As-Is

Do not change these:

- References to original Sitegeist project in documentation/fork context
- `archive/` file names (preserved originals)

## Phase 0: Page Context Functions

**Files:** `src/tools/repl/userscripts-helpers.ts`, `src/prompts/prompts.ts`, `src/tools/repl/runtime-providers.ts`, `src/tools/ask-user-which-element.ts`

- `__sitegeist_cancelled` → `__localgeist_cancelled`
- `__sitegeist_yield()` → `__localgeist_yield()`
- `__sitegeistElementPicker` → `__localgeistElementPicker`
- System prompt references to `__sitegeist_yield()` → `__localgeist_yield()`

**Note:** No references in `default-skills.ts` (verified).

**Note:** Existing IndexedDB data will be orphaned. Acceptable — all current data is from testing.

## Phase 0b: World IDs & Element Picker (userScripts)

These are internal identifiers for `chrome.userScripts` and DOM elements. They can be changed but must be consistent across files.

**Files:** `src/tools/repl/runtime-providers.ts`, `src/tools/repl/overlay-inject.ts`, `src/tools/repl/overlay-content.ts`, `src/tools/extract-image.ts`, `src/tools/ask-user-which-element.ts`

- `worldId: "sitegeist-browser-script"` → `"localgeist-browser-script"`
- `OVERLAY_WORLD_ID = "sitegeist-repl-overlay"` → `"localgeist-repl-overlay"`
- `overlay.id = 'sitegeist-repl-overlay'` → `'localgeist-repl-overlay'`
- `document.getElementById('sitegeist-repl-overlay')` → `'localgeist-repl-overlay'`
- `worldId: "sitegeist-extract-image"` → `"localgeist-extract-image"`
- `__sitegeistElementPicker` → `__localgeistElementPicker`
- `overlay.id = "sitegeist-element-picker"` → `"localgeist-element-picker"`
- `window.addEventListener("sitegeist-element-cancel", ...)` → `"localgeist-element-cancel"`
- `window.removeEventListener("sitegeist-element-cancel", ...)` → `"localgeist-element-cancel"`
- `window.dispatchEvent(new CustomEvent("sitegeist-element-cancel"))` → `"localgeist-element-cancel"`
- `.filter((c) => c && !c.startsWith("sitegeist-"))` → `"localgeist-"`

**CSS animations in `overlay-content.ts`:**
- `@keyframes sitegeist-shimmer-radial-1` → `localgeist-shimmer-radial-1`
- `@keyframes sitegeist-shimmer-radial-2` → `localgeist-shimmer-radial-2`
- `@keyframes sitegeist-shimmer-radial-3` → `localgeist-shimmer-radial-3`
- `@keyframes sitegeist-pulse` → `localgeist-pulse`
- `@keyframes sitegeist-particle-float` → `localgeist-particle-float`
- All `animation: sitegeist-*` references → `localgeist-*`

**Pain point:** These are scattered across 5 files + CSS. Must change all together or the extension will fail to inject scripts.

## Phase 1: User-Facing Strings

### System Prompt

**File:** `src/prompts/prompts.ts`
- `You are Sitegeist, not Claude.` → `You are localgeist, not Claude.`
- Comment: `Centralized prompts/descriptions for Sitegeist.` → `...for localgeist.`

### Welcome Dialog

**File:** `src/dialogs/WelcomeSetupDialog.ts`
- `title: "Welcome to Sitegeist"` → `title: "Welcome to localgeist"`

### Manifest

**File:** `static/manifest.chrome.json`
- `"name": "sitegeist"` → `"name": "localgeist"`

### Download Filenames

**File:** `src/dialogs/SkillsTab.ts`
- `sitegeist-skills-${date}.json` → `localgeist-skills-${date}.json`

**File:** `src/dialogs/SessionListDialog.ts`
- `sitegeist-session-${title}.json` → `localgeist-session-${title}.json`
- `sitegeist-sessions-${date}.json` → `localgeist-sessions-${date}.json`

### OAuth Originator

**File:** `src/oauth/openai-codex.ts`
- `url.searchParams.set("originator", "sitegeist")` → `"localgeist"`

### Tutorials

**File:** `src/tutorials.ts`
- `label: "What is Sitegeist?"` → `label: "What is localgeist?"`
- `prompt: ...understand Sitegeist...Sitegeist's capabilities...` → `...understand localgeist...localgeist's capabilities...`

### Debugger Tool

**File:** `src/tools/debugger.ts`
- `unpacked the Sitegeist extension files` → `localgeist extension files`
- `Sitegeist extension card` → `localgeist extension card`

### Tools Index Comment

**File:** `src/tools/index.ts`
- `Export sitegeist-specific REPL tool` → `Export localgeist-specific REPL tool`

### Database Name

**File:** `src/storage/app-storage.ts`
- `dbName: "sitegeist-storage"` → `dbName: "localgeist-storage"`

**Note:** Existing IndexedDB data will be orphaned. Acceptable — all current data is from testing.

### Comments

**File:** `src/messages/UserMessageRenderer.ts`
- `Custom user message component for Sitegeist` → `...for localgeist`

**File:** `src/oauth/index.ts`
- `Browser OAuth integration for sitegeist.` → `...for localgeist.`

**File:** `src/background.ts`
- `Called when Sitegeist icon is clicked` → `...localgeist icon...`

**File:** `src/debug.ts`
- `tools relying on Sitegeist storage` → `...localgeist storage...`

## Phase 2: Internal Names (Code)

### Storage Classes

**File:** `src/storage/app-storage.ts`
- `class SitegeistAppStorage` → `class LocalgeistAppStorage`
- `function getSitegeistStorage()` → `function getLocalgeistStorage()`
- Comment: `Extended AppStorage for Sitegeist` → `...for localgeist`
- Comment: `Helper to get typed Sitegeist storage.` → `...localgeist storage.`
- Comment: `Store references to sitegeist-specific stores` → `...localgeist-specific...`

**File:** `src/storage/stores/sessions-store.ts`
- `class SitegeistSessionsStore` → `class LocalgeistSessionsStore`

### Message Components

**File:** `src/messages/UserMessageRenderer.ts`
- `@customElement("sitegeist-user-message")` → `@customElement("localgeist-user-message")`
- `class SitegeistUserMessage` → `class LocalgeistUserMessage`
- Template: `<sitegeist-user-message` → `<localgeist-user-message`

**File:** `src/messages/NavigationMessage.ts`
- All `getSitegeistStorage()` → `getLocalgeistStorage()`

### Dialog Classes

**File:** `src/dialogs/SessionListDialog.ts`
- `@customElement("sitegeist-session-list-dialog")` → `@customElement("localgeist-session-list-dialog")`
- `class SitegeistSessionListDialog` → `class LocalgeistSessionListDialog`

**File:** `src/dialogs/SkillsTab.ts`
- All `getSitegeistStorage()` → `getLocalgeistStorage()`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`

**File:** `src/dialogs/CostsTab.ts`
- All `getSitegeistStorage()` → `getLocalgeistStorage()`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`

### Tool Imports

**File:** `src/tools/navigate.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- All `getSitegeistStorage()` → `getLocalgeistStorage()` (2 call sites)

**File:** `src/tools/skill.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage().skills` → `getLocalgeistStorage().skills`

**File:** `src/tools/repl/runtime-providers.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage().skills` → `getLocalgeistStorage().skills`

### Sidepanel

**File:** `src/sidepanel.ts`
- `import { SitegeistSessionListDialog }` → `import { LocalgeistSessionListDialog }`
- `import { SitegeistAppStorage }` → `import { LocalgeistAppStorage }`
- `new SitegeistAppStorage()` → `new LocalgeistAppStorage()`
- `SitegeistSessionListDialog.open(` → `LocalgeistSessionListDialog.open(`

### Debug

**File:** `src/debug.ts`
- `import { SitegeistAppStorage }` → `import { LocalgeistAppStorage }`
- `new SitegeistAppStorage()` → `new LocalgeistAppStorage()`

## Phase 3: i18n (Care Required)

**File:** `src/utils/i18n-extension.ts`
- Comment: `Sitegeist extension keys` → `localgeist extension keys`
- Variable: `sitegeistTranslations` → `localgeistTranslations`
- Comment: `Merge web-ui translations with sitegeist translations` → `...localgeist...`

**Check:** Verify no translation keys reference upstream pi-web-ui elements that would break.

## Phase 4: Config Files

**File:** `package.json`
- `"name": "sitegeist"` → `"name": "localgeist"`

**File:** `package-lock.json`
- `"name": "sitegeist"` → `"name": "localgeist"` (appears twice — regenerate via `npm install` after package.json change)

**File:** `static/manifest.chrome.json`
- `"name": "sitegeist"` → `"name": "localgeist"`

**File:** `static/icons.html`
- `<title>Sitegeist Icon Generator</title>` → `<title>localgeist Icon Generator</title>`

## Phase 5: Documentation (Keep fork context references)

**Update project name references, keep original Sitegeist attribution:**

**File:** `README.md`
- `<img ... alt="Sitegeist">` → `alt="localgeist"`
- `Sitegeist can automate...` → `localgeist can automate...`
- `sitegeist/         # this repo` → `localgeist/         # this repo`
- `Select sitegeist/dist-chrome/` → `Select localgeist/dist-chrome/`
- `Sitegeist extension` → `localgeist extension`
- `Sitegeist prompts you` → `localgeist prompts you`

**File:** `AGENTS.md`
- `Localgeist is a local-first fork of [Sitegeist]` — keep (fork context)
- `sitegeist/    (this project)` → `localgeist/    (this project)`
- `cd ../sitegeist` → `cd ../localgeist`

**File:** `simple-install.md`
- `Remove any existing Sitegeist installation` → `localgeist installation`
- `Sitegeist card` → `localgeist card`
- `Sitegeist installation` → `localgeist installation`
- `Sitegeist Details` → `localgeist Details`
- `Sitegeist icon` → `localgeist icon`

**File:** `SCRIPT_CANCELLATION.md`
- All `__sitegeist_cancelled` → `__localgeist_cancelled`
- All `__sitegeist_yield()` → `__localgeist_yield()`
- All code examples and references

**File:** `CHANGELOG.md`
- `Renamed project from Sitegeist to Localgeist` — keep (historical)
- `__sitegeist_yield()` → `__localgeist_yield()` (if still referenced)

**File:** `CREDITS.md`
- Keep all original Sitegeist attribution — do not change
- `__sitegeist_cancelled`, `__sitegeist_yield()` → `__localgeist_cancelled`, `__localgeist_yield()` (code references)

**File:** `PLAN.md`
- Update project name references where appropriate
- Keep fork context references to original Sitegeist

## Execution Order

1. Phase 0 (page context functions) — breaks existing scripts, do first
2. Phase 0b (world IDs + element picker + CSS animations) — must be consistent across 5 files, do with Phase 0
3. Phase 1 (user-facing strings + database name) — database breaks existing data
4. Phase 4 (config files) — standalone, regenerate package-lock.json
5. Phase 2 (internal names) — all renames together to avoid broken imports
6. Phase 3 (i18n) — after Phase 2, verify no upstream conflicts
7. Phase 5 (documentation) — can be done anytime, no code impact

## Pain Points

1. **World IDs (Phase 0b):** Scattered across 5 files. If any are missed, script injection fails silently.
2. **CSS animations (Phase 0b):** `overlay-content.ts` has 5 `@keyframes` names + animation references. Must match.
3. **Custom elements (Phase 2):** `@customElement("...")` decorator must match template usage. Mismatch causes Lit rendering failure.
4. **i18n (Phase 3):** Translation keys may overlap with upstream pi-web-ui. Verify before changing.
5. **package-lock.json (Phase 4):** Regenerate via `npm install` after package.json name change — do not edit manually.
6. **Documentation (Phase 5):** Keep original Sitegeist attribution in CREDITS.md and fork context references.

## Verification

After each phase:
- `npm run check` — typecheck + lint
- `npm run build` — verify build succeeds
- Manual test: load extension, verify UI text, model selection, session management
- `grep -rn "sitegeist\|Sitegeist" src/` — verify no unexpected references remain

## Verification

After each phase:
- `npm run check` — typecheck + lint
- `npm run build` — verify build succeeds
- Manual test: load extension, verify UI text, model selection, session management
