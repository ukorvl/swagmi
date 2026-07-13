import { describe, expect, it } from "vitest";

import { useSmartWriteContract, useWalletSession } from "./index";

describe("library smoke", () => {
  it("exports useSmartWriteContract", () => {
    expect(typeof useSmartWriteContract).toBe("function");
  });

  it("exports useWalletSession", () => {
    expect(typeof useWalletSession).toBe("function");
  });
});
