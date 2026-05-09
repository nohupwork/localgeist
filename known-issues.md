# Known Issues

## Dummy API Key Required for Local Providers

**Symptom:** "Error: No API key for provider: llama-server" when sending messages.

**Workaround:** When setting up the llama.cpp (or other local) provider in Settings, enter any dummy value in the API Key field (e.g., "local"). This is a workaround for a bug where the `getApiKey` function doesn't correctly find custom provider keys.

**Status:** Needs investigation. The `getApiKey` function checks `storage.customProviders.getAll()` but may have a timing issue or name mismatch.

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

**Cause:** pi-mono's `discoverLlamaCppModels` only checks `model.context_length` which is not present in llama.cpp's `/v1/models` response. The actual value is in `meta.n_ctx_train`.

**Status:** pi-mono bug. Not fixable in sitegeist.
