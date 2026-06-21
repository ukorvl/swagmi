import { stubFunction } from "typescript-library-template";

const getDocumentationIntro = (): string => {
  // Exercise package import resolution exactly as an external consumer would.
  stubFunction();

  return "Use root dev/typecheck/test commands to prebuild lib automatically when needed.";
};

export { getDocumentationIntro };
