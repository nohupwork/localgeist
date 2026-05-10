import { SettingsTab } from "@earendil-works/pi-web-ui";
import { html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sg-about-tab")
export class AboutTab extends SettingsTab {
	getTabName(): string {
		return "About";
	}

	render() {
		return html`<div class="text-center py-8 text-4xl">&#x1f44d;</div>`;
	}
}
