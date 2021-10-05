import { parse } from "fast-xml-parser";
import { Flag, Result, Test, TestContext, TestInfo, TestInput } from "./test";
import { Document } from "./document";
import { expose } from "comlink";
import * as Sentry from "@sentry/react";
import { makePageFilename } from "../lib/utils";

const commit = import.meta.env.VITE_COMMIT ?? undefined;
Sentry.init({
  dsn: "https://f5ccc3eddf4b4c7cb656355f0af02b6b@o431302.ingest.sentry.io/5992031",
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  release: commit,
});

const testModules: { test: Test }[] = Object.values(
  import.meta.globEager("./tests/*.ts")
) as any;

export type ResultWithInfo = Result & TestInfo;

function analyseFile(
  fileContents: string,
  ctx: TestContext
): { results: ResultWithInfo[]; ctx: TestInput } {
  Sentry.setContext("file", {
    filename: ctx.filename,
    pages: makePageFilename(ctx.pages),
  });

  const parsed = parse(
    fileContents,
    { attributeNamePrefix: "", ignoreAttributes: false, arrayMode: true },
    true
  );

  const testInput: TestInput = { ...ctx, hasImages: false };

  const doc = new Document(parsed);

  const results = testModules.flatMap((testModule): ResultWithInfo[] => {
    const test = testModule.test;
    const testInfo: TestInfo = {
      name: test.name,
      description: test.description,
    };

    Sentry.setTag("test", test.name);

    try {
      return test
        .exec(doc, testInput)
        .map((result) => ({ ...result, ...testInfo }));
    } catch (err) {
      Sentry.captureException(err, { tags: { test: test.name }, contexts: {} });

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

  return { results, ctx: testInput };
}

const exports = { analyseFile } as const;
export type AnalyserApi = typeof exports;
expose(exports);
