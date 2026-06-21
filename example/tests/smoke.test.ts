import { describe, expect, it } from "vitest";

import { runLibraryExample } from "../src";

describe("example workspace smoke", () => {
  it("uses the library workspace package", () => {
    expect(runLibraryExample()).toBe("ok");
  });
});
