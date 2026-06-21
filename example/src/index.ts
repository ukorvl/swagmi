import { stubFunction } from "typescript-library-template";

type StubResult = ReturnType<typeof stubFunction>;

const runLibraryExample = (): string => {
  const result: StubResult = stubFunction();

  if (result !== undefined) {
    throw new Error("stubFunction is expected to return undefined.");
  }

  return "ok";
};

export { runLibraryExample };
