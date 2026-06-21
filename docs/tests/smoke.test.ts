import { describe, expect, it } from "vitest";

import { getDocumentationIntro } from "../src/content";

describe("docs workspace smoke", () => {
  it("documents real setup flow", () => {
    expect(getDocumentationIntro()).toContain("prebuild lib automatically");
  });
});
