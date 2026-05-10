import type { NavigationMessage } from "./NavigationMessage.js";

// Extend CustomAgentMessages interface via declaration merging
declare module "@earendil-works/pi-agent-core" {
	interface CustomAgentMessages {
		navigation: NavigationMessage;
	}
}
