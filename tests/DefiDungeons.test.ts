
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const deployer = accounts.get("deployer")!;

describe("DefiDungeons Professional Tests", () => {
  it("ensures simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should allow admin to set dungeon manifest", () => {
    const newManifest = "Beware of dragons!";
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "set-dungeon-manifest",
      [
        simnet.mcv.stringAscii(newManifest) // Clarity 4 / SDK usage
      ],
      deployer
    );
    expect(result).toBeOk(simnet.mcv.bool(true));

    // Verify change
    const read = simnet.callReadOnlyFn(
      "DefiDungeons",
      "get-dungeon-manifest",
      [],
      deployer
    );
    expect(read.result).toBeOk(simnet.mcv.stringAscii(newManifest));
  });

  it("should fail when non-admin sets manifest", () => {
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "set-dungeon-manifest",
      [simnet.mcv.stringAscii("Hacked!")],
      wallet1
    );
    expect(result).toBeErr(simnet.mcv.uint(1004)); // ERR-NOT-CONTRACT-OWNER
  });

  it("should allow crafting an item (list operation)", () => {
    const materials = [simnet.mcv.uint(5), simnet.mcv.uint(6)];
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "craft-item",
      [simnet.mcv.list(materials)],
      wallet1
    );
    // 5 + 6 = 11 > 10 => Legendary
    expect(result).toBeOk(simnet.mcv.stringAscii("Legendary Item Crafted")); // Assuming contracts returns string-ascii, actually literal string in Clarity is ascii/utf8 depending on syntax, usually ascii for simple quotes.
  });

  it("should craft common item for low power", () => {
    const materials = [simnet.mcv.uint(2), simnet.mcv.uint(3)];
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "craft-item",
      [simnet.mcv.list(materials)],
      wallet1
    );
    expect(result).toBeOk(simnet.mcv.stringAscii("Common Item Crafted"));
  });
});
