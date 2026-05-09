# Install & Test

## Load Extension

1. Open Chromium, go to `chrome://extensions/`
2. Enable **Developer mode** (toggle, top-right)
3. **Remove** any existing Sitegeist installation first
4. Click **Load unpacked**
5. Select `dist-chrome/`
6. Click **Details** on the Sitegeist card
7. Enable **Allow user scripts**
8. Enable **Allow access to file URLs** (optional)
9. Pin the extension to toolbar (puzzle icon, then pin)
10. Open sidepanel, then **hard reload** (right-click on extension icon -> Reload)

## Troubleshooting

- If settings gear does nothing, check `chrome://extensions/` for errors on Sitegeist
- Click "Details" on the extension -> "Service worker" errors or "Inspect views: sidepanel"
- Clear extension storage: `chrome://extensions/` -> Sitegeist Details -> "Clear storage"

## First Run

11. Click the Sitegeist icon to open sidepanel
12. Click the **gear icon** (Settings) or "Set up provider"
13. In Settings -> select **llama.cpp** -> URL pre-fills to `http://localhost:8080`
14. Click **Discover models** -> pick a model -> start chatting

## Test Checklist

- [ ] Settings gear icon opens dialog with providers tab
- [ ] Local model connects and streams responses
- [ ] Gmail skill loads on `mail.google.com`
- [ ] Session title editing works (click title, Enter to save)
- [ ] `browserjs()` runs in REPL
