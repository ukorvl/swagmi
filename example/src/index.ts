import { useSmartWriteContract } from "typescript-library-template";

type SmartWriteHook = typeof useSmartWriteContract;

const runLibraryExample = (): string => {
  const hookName: SmartWriteHook["name"] = useSmartWriteContract.name;

  if (hookName.length === 0) {
    throw new Error("useSmartWriteContract should have a stable function name.");
  }

  return "ok";
};

export { runLibraryExample };
