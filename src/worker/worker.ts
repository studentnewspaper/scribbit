import { parse } from "fast-xml-parser";
import { Flag, Result, Test, TestContext, TestInfo } from "./test";
import { Document } from "./document";
import { expose } from "comlink";
import * as Sentry from "@sentry/react";
import { makePageFilename, makePageNumberText } from "../lib/utils";

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

function analyseFile(fileContents: string, ctx: TestContext): ResultWithInfo[] {
  Sentry.setContext("file", {
    filename: ctx.filename,
    pages: ctx.pages
      .map((page) => `${makePageNumberText(page.number)} ${page.section}`)
      .join(", "),
  });

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

    Sentry.setTag("test", test.name);

    try {
      return test.exec(doc, ctx).map((result) => ({ ...result, ...testInfo }));
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
}

const exports = { analyseFile } as const;
export type AnalyserApi = typeof exports;
expose(exports);
