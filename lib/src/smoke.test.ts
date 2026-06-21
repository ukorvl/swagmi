import { describe, expect, it } from "vitest";

import { useSmartWriteContract } from "./index";

describe("library smoke", () => {
  it("exports useSmartWriteContract", () => {
    expect(typeof useSmartWriteContract).toBe("function");
  });
});
