
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const wallet1 = accounts.get("wallet_1")!;
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
        Cl.stringAscii(newManifest)
      ],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));

    // Verify change
    const read = simnet.callReadOnlyFn(
      "DefiDungeons",
      "get-dungeon-manifest",
      [],
      deployer
    );
    expect(read.result).toBeOk(Cl.stringAscii(newManifest));
  });

  it("should fail when non-admin sets manifest", () => {
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "set-dungeon-manifest",
      [Cl.stringAscii("Hacked!")],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(1004)); // ERR-NOT-CONTRACT-OWNER
  });

  it("should allow crafting an item (list operation)", () => {
    const materials = [Cl.uint(5), Cl.uint(6)];
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "craft-item",
      [Cl.list(materials)],
      wallet1
    );
    // 5 + 6 = 11 > 10 => Legendary
    expect(result).toBeOk(Cl.stringAscii("Legendary Item Crafted"));
  });

  it("should craft common item for low power", () => {
    const materials = [Cl.uint(2), Cl.uint(3)];
    const { result } = simnet.callPublicFn(
      "DefiDungeons",
      "craft-item",
      [Cl.list(materials)],
      wallet1
    );
    expect(result).toBeOk(Cl.stringAscii("Common Item Crafted"));
  });
});
