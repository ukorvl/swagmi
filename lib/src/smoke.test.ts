import { describe, expect, it } from "vitest";

import { stubFunction } from "./index";

describe("library smoke", () => {
  it("exports stubFunction", () => {
    expect(typeof stubFunction).toBe("function");
  });
});
