// Re-export discoverModels from pi-web-ui subpath.
// TypeScript can't resolve the subpath via package.json exports, so we shim it.
import type { Model } from "@earendil-works/pi-ai";
import type { AutoDiscoveryProviderType } from "@earendil-works/pi-web-ui";

// @ts-expect-error subpath not in package.json exports, but file exists at build time
import * as discovery from "@earendil-works/pi-web-ui/dist/utils/model-discovery.js";

export const discoverModels = (discovery as any).discoverModels as (
	type: AutoDiscoveryProviderType,
	baseUrl: string,
	apiKey?: string,
) => Promise<Model<any>[]>;
