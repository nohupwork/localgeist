# Known Issues

## Model Selection Resets on New Chat

**Symptom:** Starting a new chat resets the model selector, opening the Settings page with provider options instead of restoring the previously selected local model.

**Suspected cause:** `lastUsedModel` persistence may be affected by the settings store migration (chrome.storage.local → IndexedDB). Custom providers may not be loaded when model is restored.

**Reproduction:** Select a local provider model, start a new chat → Settings page opens.

**Status:** Needs investigation. Confirm whether saved model is lost or custom provider lookup fails during restore.

---

## Chat Output Flashes Then Collapses

**Symptom:** After the model finishes responding, the output text flashes, then collapses. Only the thinking block remains visible. The actual response text is only visible after navigating away and back to the conversation (via the history tab).

**Steps to reproduce:**
1. Start a new conversation
2. Send a message
3. Wait for the model to finish responding
4. Observe: output flashes, then collapses to just the thinking block

**Workaround:** Navigate to the conversation history tab, click on the conversation to reload it. The full response text will be visible.

**Status:** Deal-breaking UI bug. Likely a Lit rendering timing issue with thinking/content blocks in the chat panel. Needs investigation in `pi-web-ui` or `sitegeist` chat rendering code.

## Cloud Providers List Too Long

**Symptom:** The model selector shows a long list of cloud providers (Anthropic, OpenAI, Google, Groq, OpenRouter, Vercel, Cerebras, xAI, Z-AI, etc.).

**Status:** Documented for later cleanup. Consider shortening, hiding, or removing cloud providers from the list since local models are the primary use case.

## Context Size Shows Default Values

**Symptom:** llama.cpp models show "8k/4k" for context/max tokens instead of the actual values (e.g., 262k for Qwen3.6-27B).

**Cause:** pi's `discoverModels` only checks `model.context_length` which is not present in llama.cpp's `/v1/models` response. The actual value is in `meta.n_ctx_train`.

**Status:** pi bug. Not fixable in Localgeist.
