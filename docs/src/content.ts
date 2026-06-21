import { useSmartWriteContract } from "@ukorvl/swagmi";

const getDocumentationIntro = (): string => {
  const hookName = useSmartWriteContract.name;

  return `Use ${hookName} from @ukorvl/swagmi for a single simulate-sign-submit-confirm lifecycle, and use the root dev/typecheck/test commands to prebuild lib automatically when needed.`;
};

export { getDocumentationIntro };
