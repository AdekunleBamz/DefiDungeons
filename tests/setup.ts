
import { getClarinetVitestsArgv } from "@stacks/clarinet-sdk/vitest";
import { initSimnet } from "@stacks/clarinet-sdk";

// Polyfill global.options for the Clarinet SDK setup
const options = {
    clarinet: await getClarinetVitestsArgv(),
};
(globalThis as any).options = options;

// Manually initialize simnet and expose it globally using top-level await
const simnet = await initSimnet(options.clarinet.manifestPath);
(globalThis as any).simnet = simnet;
