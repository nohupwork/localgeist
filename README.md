<p align="center">
  <img src="media/hero.webp" alt="localgeist" width="400">
</p>

An AI assistant that lives in your browser sidebar. Built for collaboration, not autonomy theater. You guide, it executes.

localgeist can automate repetitive web tasks, extract data from any website, navigate across pages, fill out forms, compare products, compile research, and transform what it finds into documents, spreadsheets, or whatever you need. It works on any website through a Chrome/Edge side panel, using your locally running LLM.

Supports llama.cpp, Ollama, vLLM, LM Studio, and any OpenAI-compatible API. Everything runs locally — no cloud accounts, no subscriptions.

## Building & Install

```bash
npm run build
```

Load `dist-chrome/` as an unpacked extension in Chrome/Edge (see Development section below).

Requires Chrome 141+ or Edge equivalent.

## Development

Clone this repo plus its sibling dependencies into the same parent directory:

```
parent/
  mini-lit/          # https://github.com/badlogic/mini-lit
  pi/                # https://github.com/earendil-works/pi
  localgeist/         # this repo
```

Install dependencies in each repo:

```bash
(cd ../mini-lit && npm install)
(cd ../pi && npm install)
npm install
```

`npm install` sets up the Husky pre-commit hook automatically.

The sibling repos `../mini-lit` and `../pi` are upstream dependencies. Do not modify them — they are referenced here for build resolution only.

### Loading the extension

1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable Developer mode
3. Click Load unpacked
4. Select `localgeist/dist-chrome/`
5. Click "Details" on the localgeist extension and enable:
   - **Allow user scripts**
   - **Allow access to file URLs**

### First run

On first launch, localgeist prompts you to add a provider. Point it at your local LLM server and select a model.

## Checks

```bash
./check.sh
```

Runs formatting, linting, and type checking for the extension.

The Husky pre-commit hook runs the same checks before each commit.

## Building

```bash
npm run build
```

The unpacked extension is written to `dist-chrome/`.

## License

AGPL-3.0. See [LICENSE](LICENSE).
