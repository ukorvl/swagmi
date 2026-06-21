import { useSmartWriteContract } from "@ukorvl/swagmi";

type SmartWriteHook = typeof useSmartWriteContract;
const emptyHookNameLength = 0;

const runLibraryExample = (): string => {
  const hookName: SmartWriteHook["name"] = useSmartWriteContract.name;

  if (hookName.length === emptyHookNameLength) {
    throw new Error("useSmartWriteContract should have a stable function name.");
  }

  return "ok";
};

export { runLibraryExample };
