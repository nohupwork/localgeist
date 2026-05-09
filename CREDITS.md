# Localgeist — Credits

Localgeist is a fork of [Sitegeist](https://github.com/badlogic/sitegeist) by Mario Zechner, licensed under AGPL-3.0.

This project incorporates changes from several community forks. All original and fork authors retain copyright on their respective contributions. The full project remains under AGPL-3.0.

## Original Project

- **Sitegeist** by [Mario Zechner](https://github.com/badlogic) — [github.com/badlogic/sitegeist](https://github.com/badlogic/sitegeist)
  - Foundation of this project. Browser extension architecture, agent system, tool framework, skills system, session management, and core UI.

## Community Forks

Changes borrowed from the following forks are attributed below.

### [badlogic/sitegeist](https://github.com/badlogic/sitegeist) — branch `hja`

- **Hybrid script cancellation** for `browserjs()` — cooperative cancellation via `__sitegeist_cancelled` flag and `__sitegeist_yield()` helper, with V8 termination as backup (Chrome 138+). Includes `SCRIPT_CANCELLATION.md` design documentation.
  - Files: `src/tools/repl/userscripts-helpers.ts`, `src/tools/repl/runtime-providers.ts`, `src/prompts/prompts.ts`

### [egornomic/sitegeist](https://github.com/egornomic/sitegeist)

- **Session list delete confirmation modal** — replaced browser `confirm()` with custom in-app modal for session deletion.
  - Files: `src/dialogs/SessionListDialog.ts`
- **`lastFocusedWindowId` keyboard shortcut fix** — tracks last focused window so toggle-sidepanel shortcut works even when sender windowId is unavailable.
  - Files: `src/background.ts`
- **In-page session switching** — `loadSession()` and `newSession()` rewritten as async in-page navigation instead of full page reload, with proper lock release and session save.
  - Files: `src/sidepanel.ts`
- **Attachment handling in message transformer** — properly converts user message attachments to `ImageContent` for the LLM.
  - Files: `src/messages/message-transformer.ts`
- **`isNewerVersion()` semver comparison** — proper semantic version comparison for update checks.
  - Files: `src/utils/releases.ts`
- **Default model and tool API updates** — TypeBox import path, `execute()` signature updates.
  - Files: `src/tools/*.ts`

### [IgorWarzocha/sitegeist](https://github.com/IgorWarzocha/sitegeist) — branch `dev`

- **Published pi packages migration** — switched dependencies from `file:` local paths to published npm versions (`@mariozechner/pi-agent-core`, `@mariozechner/pi-ai`, `@mariozechner/pi-web-ui`, `@mariozechner/mini-lit`).
  - Files: `package.json`
- **API compatibility fixes** — `agent.setModel()` → `agent.state.model`, `agent.appendMessage()` → `agent.state.messages.push()`, `agent.replaceMessages()` → `agent.state.messages =`.
  - Files: `src/sidepanel.ts`, `src/messages/WelcomeMessage.ts`

### [KarmanyaIyer/sitegeist](https://github.com/KarmanyaIyer/sitegeist) — branch `fix/pi-mono-compat-windows-build-custom-providers`

- **Visibility change re-render** — forces re-render when extension sidebar becomes visible after being hidden (Chrome throttles hidden panels).
  - Files: `src/sidepanel.ts`
- **`requestAnimationFrame` post-agent_end re-render** — ensures stable message list is shown after agent finishes streaming.
  - Files: `src/sidepanel.ts`
- **Windows build path fix** — cross-platform path separator handling in build script.
  - Files: `scripts/build.mjs`
- **`isNewerVersion()` semver comparison** — proper semantic version comparison for update checks.
  - Files: `src/dialogs/AboutTab.ts`
- **Custom provider support** — custom provider UI and integration in settings.
  - Files: `src/dialogs/ApiKeysOAuthTab.ts`, `src/sidepanel.ts`

### [diramazioni/sitegeist](https://github.com/diramazioni/sitegeist) — branch `fix/brave-sidepanel-init`

- **Brave browser compatibility** — Mojo and PageHandler stubs to prevent ReferenceError in Brave's color_change_listener.
  - Files: `static/theme-loader.js`
- **Robust init with error boundaries** — try/catch wrapping of `initApp()` with `showError()` fallback UI, timeout guards for permission dialogs.
  - Files: `src/sidepanel.ts`
- **Color scheme meta tag** — added `<meta name="color-scheme" content="light dark">` to sidepanel.
  - Files: `static/sidepanel.html`

### [edgyarmati/ghostintheweb](https://github.com/edgyarmati/ghostintheweb) — branch `fix/append-message-and-gpt-5.4-mini`

- **API compatibility patch** — `agent.setModel()` → `agent.state.model`, `agent.appendMessage()` → `agent.state.messages.push()`.
- **Post-stream re-render** — `waitForIdle()` re-render after `agent_end` event.
  - Files: `src/sidepanel.ts`

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

All incorporated code from the original Sitegeist and community forks remains under AGPL-3.0. Copyright holders of each contribution retain their respective copyrights.
