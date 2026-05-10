# Rename sitegeist → localgeist

## Naming Convention

- `localgeist` (all lowercase) in documentation, UI text, filenames, manifest
- `Localgeist` only where code convention requires it (PascalCase class names)
- `getLocalgeist*` (camelCase) for function names

## Keep As-Is

Do not change these:

- References to original Sitegeist project in documentation/fork context
- `archive/` file names (preserved originals)
- `CREDITS.md` — historical attribution to original Sitegeist and contributors

## Phase 0: Page Context Functions

Injected into page contexts. Simple string replacements, no imports affected.

**File:** `src/tools/repl/userscripts-helpers.ts`
- `(window as any).__sitegeist_cancelled` → `__localgeist_cancelled` (2 references)
- `(window as any).__sitegeist_yield` → `__localgeist_yield` (2 references, including `delete`)

**File:** `src/prompts/prompts.ts`
- `__sitegeist_yield()` → `__localgeist_yield()` (4 references in system prompt and examples)

**File:** `src/tools/repl/runtime-providers.ts`
- `window.__sitegeist_cancelled = true` → `window.__localgeist_cancelled = true`

**File:** `src/tools/ask-user-which-element.ts`
- `__sitegeistElementPicker` → `__localgeistElementPicker` (4 references: type, check, set, delete)

**Note:** No references in `default-skills.ts` (verified).

**Status:** DONE. `npm run check` and `npm run build` pass. Zero `__sitegeist` / `sitegeistElementPicker` references remain in affected files.

## Phase 0b: World IDs & Element Picker (userScripts)

Internal identifiers for `chrome.userScripts` and DOM elements. Must be consistent across files or injection fails silently.

**File:** `src/tools/repl/runtime-providers.ts`
- `FIXED_WORLD_ID = "sitegeist-browser-script"` → `"localgeist-browser-script"`

**File:** `src/tools/repl/overlay-inject.ts`
- `OVERLAY_WORLD_ID = "sitegeist-repl-overlay"` → `"localgeist-repl-overlay"`

**File:** `src/tools/repl/overlay-content.ts`
- `overlay.id = 'sitegeist-repl-overlay'` → `'localgeist-repl-overlay'`
- `document.getElementById('sitegeist-repl-overlay')` → `'localgeist-repl-overlay'` (2 references)
- `@keyframes sitegeist-shimmer-radial-1` → `localgeist-shimmer-radial-1`
- `@keyframes sitegeist-shimmer-radial-2` → `localgeist-shimmer-radial-2`
- `@keyframes sitegeist-shimmer-radial-3` → `localgeist-shimmer-radial-3`
- `@keyframes sitegeist-pulse` → `localgeist-pulse`
- `@keyframes sitegeist-particle-float` → `localgeist-particle-float`
- `animation: sitegeist-shimmer-radial-1` → `localgeist-shimmer-radial-1`
- `animation: sitegeist-shimmer-radial-2` → `localgeist-shimmer-radial-2`
- `animation: sitegeist-shimmer-radial-3` → `localgeist-shimmer-radial-3`
- `animation: sitegeist-pulse` → `localgeist-pulse`
- `animation: sitegeist-particle-float` → `localgeist-particle-float`

**File:** `src/tools/extract-image.ts`
- `worldId: "sitegeist-extract-image"` → `"localgeist-extract-image"` (2 references)

**File:** `src/tools/ask-user-which-element.ts`
- `overlay.id = "sitegeist-element-picker"` → `"localgeist-element-picker"`
- `window.addEventListener("sitegeist-element-cancel", ...)` → `"localgeist-element-cancel"`
- `window.removeEventListener("sitegeist-element-cancel", ...)` → `"localgeist-element-cancel"`
- `window.dispatchEvent(new CustomEvent("sitegeist-element-cancel"))` → `"localgeist-element-cancel"`
- `.filter((c) => c && !c.startsWith("sitegeist-"))` → `"localgeist-"`

**Status:** DONE. `npm run check` and `npm run build` pass. Zero `sitegeist` references remain in affected files.

## Phase 1: User-Facing Strings

Display text, comments, manifest. No code references affected.

**File:** `src/prompts/prompts.ts`
- `You are Sitegeist, not Claude.` → `You are localgeist, not Claude.`
- Comment: `Centralized prompts/descriptions for Sitegeist.` → `...for localgeist.`

**File:** `src/dialogs/WelcomeSetupDialog.ts`
- `title: "Welcome to Sitegeist"` → `title: "Welcome to localgeist"`

**File:** `src/tutorials.ts`
- `label: "What is Sitegeist?"` → `label: "What is localgeist?"`
- `prompt: ...understand Sitegeist...Sitegeist's capabilities...` → `...understand localgeist...localgeist's capabilities...`

**File:** `src/dialogs/SkillsTab.ts`
- `a.download = \`sitegeist-skills-${...}.json\`` → \`localgeist-skills-${...}.json\`

**File:** `src/dialogs/SessionListDialog.ts`
- \``sitegeist-session-${...}.json\`` → \``localgeist-session-${...}.json\``
- \``sitegeist-sessions-${...}.json\`` → \``localgeist-sessions-${...}.json\`

**File:** `src/oauth/openai-codex.ts`
- `url.searchParams.set("originator", "sitegeist")` → `"localgeist"`

**File:** `src/tools/debugger.ts`
- `unpacked the Sitegeist extension files` → `localgeist extension files`
- `Sitegeist extension card` → `localgeist extension card`

**File:** `src/tools/index.ts`
- `Export sitegeist-specific REPL tool` → `Export localgeist-specific REPL tool`

**File:** `src/messages/UserMessageRenderer.ts`
- Comment: `Custom user message component for Sitegeist` → `...for localgeist`

**File:** `src/oauth/index.ts`
- Comment: `Browser OAuth integration for sitegeist.` → `...for localgeist.`

**File:** `src/background.ts`
- Comment: `Called when Sitegeist icon is clicked` → `...localgeist icon...`

**File:** `src/debug.ts`
- Comment: `tools relying on Sitegeist storage` → `...localgeist storage...`

**File:** `src/storage/app-storage.ts`
- `dbName: "sitegeist-storage"` → `"localgeist-storage"`

**Note:** Database name change orphans existing IndexedDB data. Acceptable — all current data is from testing.

**Status:** DONE. `npm run check` and `npm run build` pass. Remaining references in affected files are Phase 2 items (class/function names).

## Phase 2: Internal Names (Code)

Class/function renames and import updates. TypeScript catches broken imports; custom element mismatches may only show at runtime.

**File:** `src/storage/app-storage.ts`
- `class SitegeistAppStorage` → `class LocalgeistAppStorage`
- `function getSitegeistStorage()` → `function getLocalgeistStorage()`
- `getAppStorage() as SitegeistAppStorage` → `as LocalgeistAppStorage`
- Comment: `Extended AppStorage for Sitegeist` → `...for localgeist`
- Comment: `Helper to get typed Sitegeist storage.` → `...localgeist storage.`
- Comment: `Store references to sitegeist-specific stores` → `...localgeist-specific...`

**File:** `src/storage/stores/sessions-store.ts`
- `class SitegeistSessionsStore` → `class LocalgeistSessionsStore`

**File:** `src/messages/UserMessageRenderer.ts`
- `@customElement("sitegeist-user-message")` → `@customElement("localgeist-user-message")`
- `class SitegeistUserMessage` → `class LocalgeistUserMessage`
- Template: `<sitegeist-user-message` → `<localgeist-user-message` (2 references in html\`...\`)

**File:** `src/messages/NavigationMessage.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage().skills` → `getLocalgeistStorage().skills` (2 call sites)

**File:** `src/dialogs/SessionListDialog.ts`
- `@customElement("sitegeist-session-list-dialog")` → `@customElement("localgeist-session-list-dialog")`
- `class SitegeistSessionListDialog` → `class LocalgeistSessionListDialog`
- `new SitegeistSessionListDialog()` → `new LocalgeistSessionListDialog()`

**File:** `src/dialogs/SkillsTab.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage()` → `getLocalgeistStorage()` (6 call sites)

**File:** `src/dialogs/CostsTab.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage()` → `getLocalgeistStorage()` (2 call sites)

**File:** `src/tools/navigate.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage().skills` → `getLocalgeistStorage().skills` (2 call sites)

**File:** `src/tools/skill.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage().skills` → `getLocalgeistStorage().skills`

**File:** `src/tools/repl/runtime-providers.ts`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }`
- `getSitegeistStorage().skills` → `getLocalgeistStorage().skills`

**File:** `src/sidepanel.ts`
- `import { SitegeistSessionListDialog }` → `import { LocalgeistSessionListDialog }`
- `import { SitegeistAppStorage }` → `import { LocalgeistAppStorage }`
- `new SitegeistAppStorage()` → `new LocalgeistAppStorage()`
- `SitegeistSessionListDialog.open(` → `LocalgeistSessionListDialog.open(`

**File:** `src/debug.ts`
- `import { SitegeistAppStorage }` → `import { LocalgeistAppStorage }`
- `new SitegeistAppStorage()` → `new LocalgeistAppStorage()`

**Status:** DONE. `npm run check` and `npm run build` pass. Remaining references are Phase 3 (i18n).

## Phase 3: i18n (Care Required)

**File:** `src/utils/i18n-extension.ts`
- Comment: `Sitegeist extension keys` → `localgeist extension keys`
- Variable: `const sitegeistTranslations` → `const localgeistTranslations`
- Comment: `Merge web-ui translations with sitegeist translations` → `...localgeist...`
- `...sitegeistTranslations.en` → `...localgeistTranslations.en`
- `...sitegeistTranslations.de` → `...localgeistTranslations.de`

**Check:** Verify no translation keys inside the object literal reference upstream pi-web-ui elements.

**Status:** DONE. `npm run check` and `npm run build` pass. Zero `sitegeist`/`Sitegeist` references remain in `src/`.

## Phase 4: Config Files

**File:** `package.json`
- `"name": "sitegeist"` → `"name": "localgeist"`

**File:** `static/manifest.chrome.json`
- `"name": "sitegeist"` → `"name": "localgeist"`

**File:** `static/icons.html`
- `<title>Sitegeist Icon Generator</title>` → `<title>localgeist Icon Generator</title>`

**After:** Run `npm install` to regenerate `package-lock.json` with new name. Do not edit manually.

**Status:** DONE. `npm run check` and `npm run build` pass. `package-lock.json` regenerated via `npm install`.

## Phase 5: Documentation (Keep fork context references)

**File:** `README.md`
- `<img ... alt="Sitegeist">` → `alt="localgeist"`
- `Sitegeist can automate...` → `localgeist can automate...`
- `sitegeist/         # this repo` → `localgeist/         # this repo`
- `Select \`sitegeist/dist-chrome/\`` → \`localgeist/dist-chrome/\`
- `Sitegeist extension` → `localgeist extension`
- `Sitegeist prompts you` → `localgeist prompts you`
- **Keep:** Link to original Sitegeist project if present

**File:** `simple-install.md`
- `Remove any existing Sitegeist installation` → `localgeist installation`
- `Sitegeist card` → `localgeist card`
- `Sitegeist Details` → `localgeist Details`
- `Sitegeist icon` → `localgeist icon`

**File:** `CHANGELOG.md`
- Remove stale entry from `### Breaking Changes`: `Renamed project from Sitegeist to Localgeist. All references updated.` (written before rename was executed)
- Add entry under `### Changed`: `Renamed project to localgeist (all references, UI, manifests, code)`
- Update `### Added` entry: `__sitegeist_yield()` → `__localgeist_yield()` (describes current helper name)
- Do not modify `[1.0.0]` or any released version sections

**File:** `PLAN.md`
- Move "Rename sitegeist → localgeist" section (lines 49-69) to "Completed" section
- Deferred "Promise Wrapping" section: `__sitegeist_yield()` → `__localgeist_yield()` (describes current helper name)
- **Keep:** `localgeist is a local-first fork of [Sitegeist]` (fork context, title line)
- **Keep:** All other fork-context references to original Sitegeist

**File:** `AGENTS.md`
- `sitegeist/    (this project)` → `localgeist/    (this project)`
- `cd ../sitegeist` → `cd ../localgeist`
- **Keep:** `Localgeist is a local-first fork of [Sitegeist]` (fork context)
- **Keep:** `archive/  # Archived original files from upstream Sitegeist` (fork context)

## Phase 5b: Technical Docs

Documentation in `docs/` and build scripts. Code examples and paths must reflect renamed classes, functions, and database.

**File:** `docs/storage.md`
- `Sitegeist uses a unified...` → `localgeist uses a unified...` (intro paragraph)
- `...and extended in Sitegeist with additional stores...` → `...and extended in localgeist...`
- `Single IndexedDB database sitegeist-storage` → `localgeist-storage` (2 references)
- `dbName: 'sitegeist-storage'` → `'localgeist-storage'` (code example)
- `Extension stores (Sitegeist-specific)` → `(localgeist-specific)`
- `## Extension Stores (Sitegeist)` → `## Extension Stores (localgeist)`
- `### SitegeistAppStorage (extension)` → `### LocalgeistAppStorage (extension)`
- `Extends base storage with Sitegeist-specific stores.` → `...localgeist-specific...`
- `const storage = getSitegeistStorage()` → `getLocalgeistStorage()` (code example)
- `IndexedDB → sitegeist-storage` → `localgeist-storage`
- `### Extension Storage (sitegeist)` → `(localgeist)`
- `app-storage.ts - SitegeistAppStorage` → `LocalgeistAppStorage`

**File:** `docs/settings.md`
- `Sitegeist uses a key-value...` → `localgeist uses a key-value...`
- `import { getSitegeistStorage }` → `import { getLocalgeistStorage }` (code example)
- `const storage = getSitegeistStorage()` → `getLocalgeistStorage()` (code example)
- `Database: sitegeist-storage` → `localgeist-storage`

**File:** `docs/i18n.md`
- `Sitegeist uses the mini-lit...` → `localgeist uses the mini-lit...`
- `Sitegeist - Extension-specific translations` → `localgeist - Extension-specific translations`
- `Import i18n-extension.js - Required for Sitegeist keys` → `...localgeist keys`
- `Required for Sitegeist translations` → `...localgeist translations` (2 references)
- `IMPORTANT: Always import... Sitegeist-specific translation keys` → `...localgeist-specific...`
- `sitegeistTranslations.en` → `localgeistTranslations.en` (code examples, 2 references)
- `sitegeistTranslations.de` → `localgeistTranslations.de` (code examples, 2 references)
- `const sitegeistTranslations = {` → `const localgeistTranslations = {` (code examples, 2 references)
- `Add the English translation to the sitegeistTranslations.en object` → `localgeistTranslations.en`
- `Add the German translation to the sitegeistTranslations.de object` → `localgeistTranslations.de`
- `Fix: Add the German translation to sitegeistTranslations.de` → `localgeistTranslations.de`
- `English translations (sitegeistTranslations.en)` → `(localgeistTranslations.en)`
- `German translations (sitegeistTranslations.de)` → `(localgeistTranslations.de)`

**File:** `docs/proxy.md`
- `Sitegeist uses a CORS Proxy` → `localgeist uses a CORS Proxy`
- `#### Sitegeist (Extension)` → `#### localgeist (Extension)`
- `Not used by Sitegeist` → `localgeist` (2 references)
- `Not used by Sitegeist - Sitegeist only uses` → `localgeist - localgeist only uses`
- `Tool has optional corsProxyUrl property set by Sitegeist` → `...by localgeist`
- `Settings stored in IndexedDB under sitegeist-storage database` → `localgeist-storage`
- `### Sitegeist Extension` → `### localgeist Extension`
- `USED by Sitegeist` → `localgeist`
- `NOT used by Sitegeist` → `localgeist` (2 references)

**File:** `docs/prompts.md`
- `### Sitegeist Prompts` → `### localgeist Prompts`
- `Sitegeist-specific prompts:` → `localgeist-specific prompts:`
- `Sitegeist-specific tools` → `localgeist-specific tools`
- `Sitegeist-specific prompts` → `localgeist-specific prompts`
- Convert absolute paths to relative (from `docs/`):
  - `/Users/badlogic/workspaces/sitegeist/src/...` → `../src/...` (10 paths)
  - `/Users/badlogic/workspaces/pi-mono/packages/web-ui/src/...` → `../../pi/packages/web-ui/src/...` (5 paths)

**File:** `docs/custom-ui-messages.md`
- Convert absolute paths to relative (from `docs/`):
  - `sitegeist/src/messages/NavigationMessage.ts` → `../src/messages/NavigationMessage.ts`
  - `sitegeist/src/messages/WelcomeMessage.ts` → `../src/messages/WelcomeMessage.ts`
  - `sitegeist/src/message-transformer.ts` → `../src/message-transformer.ts`
  - `sitegeist/src/sidepanel.ts` → `../src/sidepanel.ts`

**File:** `docs/multi-window.md`
- `Sitegeist implements window-scoped...` → `localgeist implements window-scoped...`

**File:** `docs/skills.md`
- `Sitegeist ships with built-in skills` → `localgeist ships with built-in skills`

**File:** `docs/tool-renderers.md`
- `sitegeist Extension:` → `localgeist Extension:`
- `sitegeist/src/tools/` → `../src/tools/`

**File:** `scripts/build.mjs`
- `resolve to sitegeist's node_modules` → `localgeist's node_modules`

**Keep:** `CREDITS.md` entirely (historical attribution, per plan rules)

## Execution Order

1. Phase 0 (page context functions) — simple string replacements, no imports
2. Phase 0b (world IDs + element picker + CSS animations) — must match across 5 files
3. Phase 1 (user-facing strings + database name) — database orphans existing data
4. Phase 4 (config files) — standalone, regenerate package-lock.json via `npm install`
5. Phase 2 (internal names) — all renames together to avoid broken imports
6. Phase 3 (i18n) — after Phase 2, verify no upstream conflicts
7. Phase 5 (documentation) — can be done anytime, no code impact
8. Phase 5b (technical docs) — code examples, paths, build scripts

## Pain Points

1. **World IDs (Phase 0b):** Scattered across 5 files. If any are missed, `chrome.userScripts` injection fails silently.
2. **CSS animations (Phase 0b):** `overlay-content.ts` has 5 `@keyframes` names + 5 matching `animation:` references. Mismatch = broken overlay.
3. **Custom elements (Phase 2):** `@customElement("...")` decorator must match html template tag name. Mismatch causes Lit rendering failure at runtime (TypeScript won't catch).
4. **i18n (Phase 3):** Translation keys may overlap with upstream pi-web-ui. Verify before changing.
5. **package-lock.json (Phase 4):** Must regenerate via `npm install` — manual edits break integrity hashes.

## Verification

After each phase:
- `npm run check` — typecheck + lint
- `npm run build` — verify build succeeds
- Manual test: load extension, verify UI text, model selection, session management
- `grep -rn "sitegeist\|Sitegeist" src/` — verify no unexpected references remain
