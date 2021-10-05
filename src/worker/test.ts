import { Document } from "./document";

export enum Flag {
  Pass = "pass",
  Fail = "fail",
  Warn = "warn",
  Message = "message",
  Error = "error",
}

export type Result = {
  status: Flag;
  message?: string;
};

export type PageInfo = {
  number: number;
  section: string;
};

export type TestContext = {
  filename: string;
  pages: PageInfo[];
};

export type TestInput = TestContext & {
  hasImages: boolean;
};

export type TestInfo = {
  name: string;
  description?: string;
};

export type Test = {
  exec: (doc: Document, ctx: TestInput) => Result[];
} & TestInfo;

export function pass(message?: string): Result {
  return { status: Flag.Pass, message };
}

export function fail(message?: string): Result {
  return { status: Flag.Fail, message };
}

export function info(message: string): Result {
  return { status: Flag.Message, message };
}
