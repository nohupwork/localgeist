// Stub out Chromium's Mojo and PageHandler to avoid errors in Brave/Chromium
// The injected color_change_listener uses PageHandler.getRemote which depends on
// internal Mojo bindings that may not be fully available in extension contexts.
// We provide minimal stubs to prevent ReferenceError.
if (typeof Mojo === 'undefined') {
  window.Mojo = {
    // Minimal stub to satisfy bindings checks
    InterfaceProxyBase: function() {},
    InterfaceRemoteBase: function() {}
  };
}

if (typeof PageHandler === 'undefined' || !PageHandler.getRemote) {
  window.PageHandler = {
    getRemote: (name) => {
      // Return a resolved promise with an empty provider object.
      return Promise.resolve({});
    }
  };
}

// Apply theme immediately to prevent white flash
// This runs before any other scripts or CSS
(function() {
	const theme = localStorage.getItem('theme') || 'system';
	if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		document.documentElement.classList.add('dark');
	}
})();
