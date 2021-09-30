import { Document } from "./document";

export enum Flag {
  Pass = "pass",
  Fail = "fail",
  Warn = "warn",
  Message = "message",
  Error = "error",
}

type Diff = [expected: string, actual: string];

export type Result = {
  status: Flag;
  message?: string;
  diff?: Diff;
};

export type PageInfo = {
  number: number;
  section: string;
};

export type TestContext = {
  filename: string;
  pages: PageInfo[];
};

export type TestInfo = {
  name: string;
  description?: string;
};

export type Test = {
  exec: (doc: Document, ctx: TestContext) => Result[];
} & TestInfo;

export function pass(message?: string): Result {
  return { status: Flag.Pass, message };
}

export function fail(message?: string, diff?: Diff): Result {
  return { status: Flag.Fail, message, diff };
}

export function info(message: string): Result {
  return { status: Flag.Message, message };
}
