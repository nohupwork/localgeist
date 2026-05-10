# Localgeist — Deferred Items

Items reviewed during the pi API audit that are intentionally deferred for future consideration.

## `executionMode` on tools

**Status:** Deferred — sequential default is correct for current use case.

**Detail:** The `AgentTool` interface supports `executionMode?: "sequential" | "parallel"` for per-tool override. Currently all tools use the Agent-level default (`toolExecution: "sequential"`). With a single LLM backend, parallel execution provides no benefit.

**When to revisit:** If running multiple LLM backends or if I/O-bound tools (screenshots, tab queries) could benefit from concurrent execution while the model waits.

**Effort:** Low — add `executionMode: "parallel"` to specific tools when needed.
