# Known Issues

## Model Selection Resets on New Chat

**Symptom:** Starting a new chat resets the model selector, opening the Settings page with provider options instead of restoring the previously selected local model.

**Suspected cause:** `lastUsedModel` persistence may be affected by the settings store migration (chrome.storage.local → IndexedDB). Custom providers may not be loaded when model is restored.

**Reproduction:** Select a local provider model, start a new chat → Settings page opens.

**Status:** Needs investigation. Confirm whether saved model is lost or custom provider lookup fails during restore.

---

## Cloud Providers List Too Long

**Symptom:** The model selector shows a long list of cloud providers (Anthropic, OpenAI, Google, Groq, OpenRouter, Vercel, Cerebras, xAI, Z-AI, etc.).

**Status:** Documented for later cleanup. Consider shortening, hiding, or removing cloud providers from the list since local models are the primary use case.

## Context Size Shows Default Values

**Symptom:** llama.cpp models show "8k/4k" for context/max tokens instead of the actual values (e.g., 262k for Qwen3.6-27B).

**Cause:** pi's `discoverModels` only checks `model.context_length` which is not present in llama.cpp's `/v1/models` response. The actual value is in `meta.n_ctx_train`.

**Status:** pi bug. Not fixable in Localgeist.
