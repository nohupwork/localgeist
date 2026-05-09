// Session title editing — onBlur handler (removed 2025-05-02)
//
// mini-lit's Input component does not support onBlur.
// Current solution: Enter (save) / Escape (cancel) via onKeyDown.
//
// Once mini-lit adds onBlur support, uncomment/replace the onKeyDown block
// with the following onBlur handler in sidepanel.ts (Input props for title editing):

/*
onBlur: async (e: Event) => {
    const newTitle = (e.target as HTMLInputElement).value.trim();
    if (newTitle && newTitle !== currentTitle && storage.sessions && currentSessionId) {
        await storage.sessions.updateTitle(currentSessionId, newTitle);
        currentTitle = newTitle;
    }
    isEditingTitle = false;
    renderApp();
},
*/

// Required change in mini-lit/src/Input.ts:
// 1. Add onBlur?: (e: Event) => void; to InputProps interface
// 2. Destructure onBlur in component props
// 3. Add const handleBlur = (e: Event) => { onBlur?.(e); };
// 4. Add @blur=${handleBlur} to the <input> element
