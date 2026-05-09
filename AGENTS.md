# Localgeist — Development Rules

## First Message
If the user did not give you a concrete task, read README.md first.

## What Is This Project
Localgeist is a local-first fork of [Sitegeist](https://github.com/badlogic/sitegeist). All cloud API integrations (OAuth, API key dialogs, update checks) have been stripped. The extension works with locally running LLM models (llama.cpp, Ollama, LM Studio) via custom providers. Original files are preserved in `archive/`.

## Commands
- After code changes: run `npm run check`. Fix all errors and warnings before committing.
- The user runs `../pi-mono/dev.sh` or equivalent in a separate tmux session. Do not run `npm run dev` or `npm run build` unless asked.
- NEVER commit unless the user asks.

## Code Quality
- No `any` types unless absolutely necessary (7 tool `as any` casts are accepted — TypeScript contravariance with `AgentTool`, params validated by TypeBox schemas at runtime)
- Check node_modules for external API type definitions instead of guessing
- NEVER use inline imports (no `await import(...)`, no `import("pkg").Type`)
- Always ask before removing functionality or code that appears intentional

## Dependencies
- `@mariozechner/mini-lit`, `@mariozechner/pi-ai`, `@mariozechner/pi-web-ui`, `@mariozechner/pi-agent-core` are linked via `file:` to sibling repos `../mini-lit` and `../pi-mono`
- Changes to those packages require rebuilding them (the dev watcher handles this)
- If you need to modify upstream code, edit it in `../pi-mono` or `../mini-lit` directly and rebuild

## Changelog
Location: `CHANGELOG.md`

### Format
Use these sections under `## [Unreleased]`:
- `### Breaking Changes`
- `### Added`
- `### Changed`
- `### Fixed`
- `### Removed`

### Rules
- New entries ALWAYS go under `## [Unreleased]`
- Append to existing subsections, do not create duplicates
- NEVER modify already-released version sections

## Style
- No emojis in commits, code, or comments
- No fluff or cheerful filler text
- Technical prose only, direct and concise

## Git Rules
- NEVER use `git add -A` or `git add .`
- ALWAYS use `git add <specific-file-paths>`
- NEVER use `git reset --hard`, `git checkout .`, `git clean -fd`, `git stash`
- NEVER use `git commit --no-verify`
- Include `fixes #<number>` or `closes #<number>` in commit messages when applicable

## Building and Running

Requires sibling repos:

```
parent/
  mini-lit/
  pi-mono/
  sitegeist/    (this project)
```

### First-time setup

```bash
cd ../mini-lit  && npm install && npm run build
cd ../pi-mono   && npm install && npm run build
cd ../sitegeist && npm install && npm run build
```

### Day-to-day

```bash
npm run dev       # sitegeist extension watcher only
npm run build     # production build -> dist-chrome/
npx tsc --noEmit  # typecheck
```

Load `dist-chrome/` as unpacked extension in Chrome/Edge. Enable "Allow user scripts" in extension details.

## Known Issues

See `known-issues.md` for:
- Dummy API key requirement for local providers
- Chat output flash/collapse UI bug
- Context size showing default values

## CORS Proxy Notes

The proxy setting is only used for OAuth token refresh and `extract_document` tool. For local models (localhost), no proxy is needed — the extension has `http://localhost/*` and `http://127.0.0.1/*` in `host_permissions`.

## Project Structure

```
src/
  sidepanel.ts          # Main entry point, agent setup, settings, rendering
  background.ts         # Service worker (sidepanel toggle, session locks)
  dialogs/              # Settings tabs, costs, skills, welcome setup
  tools/                # Agent tools (navigate, REPL, extract-image, skills, debugger)
  messages/             # Custom message types (navigation, welcome)
  storage/              # IndexedDB storage (sessions, skills, costs)
  prompts/              # System prompt and token counting
  components/           # UI components (Toast, TabPill, OrbAnimation)
  utils/                # Utilities (i18n, favicon, logger, port)
static/
  manifest.chrome.json  # Extension manifest (version lives here)
  cors-rules.json       # declarativeNetRequest CORS rules
archive/                # Archived original files from upstream Sitegeist
```
