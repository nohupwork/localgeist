# Rename sitegeist → localgeist

## Naming Convention

- `localgeist` (all lowercase) in documentation, UI text, filenames, manifest
- `Localgeist` only where code convention requires it (PascalCase class names)
- `localgeist*` (camelCase) for function names

## Keep As-Is

Do not change these — they break existing functionality or data:

- `__sitegeist_yield()`, `__sitegeist_cancelled` — injected into page contexts
- Database name `sitegeist-storage` — changing breaks existing user data
- References to original Sitegeist project in documentation/fork context
- `archive/` file names (preserved originals)

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

**File:** `src/dialogs/CostsTab.ts`
- All `getSitegeistStorage()` → `getLocalgeistStorage()`

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

## Execution Order

1. Phase 1 (user-facing strings) — no code references affected
2. Phase 4 (package.json) — standalone
3. Phase 2 (internal names) — all renames together to avoid broken imports
4. Phase 3 (i18n) — after Phase 2, verify no upstream conflicts

## Verification

After each phase:
- `npm run check` — typecheck + lint
- `npm run build` — verify build succeeds
- Manual test: load extension, verify UI text, model selection, session management
