import { useSmartWriteContract } from "typescript-library-template";

const getDocumentationIntro = (): string => {
  const hookName = useSmartWriteContract.name;

  return `Use ${hookName} for a single simulate-sign-submit-confirm lifecycle, and use the root dev/typecheck/test commands to prebuild lib automatically when needed.`;
};

export { getDocumentationIntro };
