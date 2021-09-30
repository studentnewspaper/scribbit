import { Flag, PageInfo } from "../worker/test";

export function isTruthy<T>(x: T | null | undefined | false): x is T {
  return !!x;
}

export function makePageNumberText(n: number): string {
  return n.toString().padStart(2, "0");
}

export function makePageFilename(pages: PageInfo[]): string {
  if (pages.length == 1) {
    const page = pages[0];
    return `${makePageNumberText(page.number)} ${page.section}.sla`;
  }

  const pageNumbers = pages.map((p) => makePageNumberText(p.number)).join("-");
  if (pages[0].section == pages[1].section) {
    return `${pageNumbers} ${pages[0].section}.sla`;
  }

  return `${pageNumbers} ${pages[0].section}-${pages[1].section}.sla`;
}

export enum FlagImportance {
  High = 0,
  Medium = 1,
  Low = 2,
}

export const flagConfig: Record<
  Flag,
  { groupName: string; importance: FlagImportance }
> = {
  [Flag.Pass]: { groupName: "Passing tests", importance: FlagImportance.Low },
  [Flag.Fail]: { groupName: "Failing tests", importance: FlagImportance.High },
  [Flag.Warn]: { groupName: "Warnings", importance: FlagImportance.Medium },
  [Flag.Message]: { groupName: "Messages", importance: FlagImportance.Low },
  [Flag.Error]: { groupName: "Errors", importance: FlagImportance.High },
};
