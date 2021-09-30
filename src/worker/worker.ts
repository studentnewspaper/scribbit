import { parse } from "fast-xml-parser";
import { Flag, Result, Test, TestContext, TestInfo } from "./test";
import { Document } from "./document";
import { expose } from "comlink";

const testModules: { test: Test }[] = Object.values(
  import.meta.globEager("./tests/*.ts")
) as any;

export type ResultWithInfo = Result & TestInfo;

function analyseFile(fileContents: string, ctx: TestContext): ResultWithInfo[] {
  const parsed = parse(
    fileContents,
    { attributeNamePrefix: "", ignoreAttributes: false, arrayMode: true },
    true
  );

  const doc = new Document(parsed);

  return testModules.flatMap((testModule): ResultWithInfo[] => {
    const test = testModule.test;
    const testInfo: TestInfo = {
      name: test.name,
      description: test.description,
    };

    try {
      return test.exec(doc, ctx).map((result) => ({ ...result, ...testInfo }));
    } catch (err) {
      console.error(err);
      let message = "An unknown error occurred - please check the console";

      if (err instanceof Error) {
        message = err.message;
      }

      return [
        {
          ...testInfo,
          status: Flag.Error,
          message,
        },
      ];
    }
  });
}

const exports = { analyseFile } as const;
export type AnalyserApi = typeof exports;
expose(exports);
