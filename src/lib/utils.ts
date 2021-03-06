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
    return `${makePageNumberText(page.number)} ${page.section}`;
  }

  const pageNumbers = pages.map((p) => makePageNumberText(p.number)).join("-");
  if (pages[0].section == pages[1].section) {
    return `${pageNumbers} ${pages[0].section}`;
  }

  return `${pageNumbers} ${pages[0].section}-${pages[1].section}`;
}

export function parsePageFilename(filename: string): PageInfo[] | null {
  const tests: {
    regex: RegExp;
    onMatch: (parts: string[]) => PageInfo[] | null;
  }[] = [
    {
      // Single page: 24 Features.sla
      regex: /^(\d{1,2}) (.+)\.sla$/g,
      onMatch: (groups) => [
        { number: parseInt(groups[0]), section: groups[1].trim() },
      ],
    },
    {
      // Double spread in same section
      regex: /^(\d{1,2})-(\d{1,2}) (.+).sla$/g,
      onMatch: (groups) => [
        { number: parseInt(groups[0]), section: groups[2].trim() },
        { number: parseInt(groups[1]), section: groups[2].trim() },
      ],
    },
    {
      // Double spread across sections
      regex: /^(\d{1,2})-(\d{1,2}) (.+)-(.+).sla$/g,
      onMatch: (groups) => [
        { number: parseInt(groups[0]), section: groups[2].trim() },
        { number: parseInt(groups[1]), section: groups[3].trim() },
      ],
    },
  ];

  for (const test of tests) {
    for (const match of filename.matchAll(test.regex)) {
      const result = test.onMatch(match.slice(1));
      if (result != null) return result;
    }
  }

  return null;
}

export const flagConfig: Record<Flag, { groupName: string; open?: boolean }> = {
  [Flag.Fail]: { groupName: "Failing tests", open: true },
  [Flag.Warn]: { groupName: "Warnings", open: true },
  [Flag.Error]: { groupName: "Errors" },
  [Flag.Message]: { groupName: "Messages" },
  [Flag.Pass]: { groupName: "Passing tests" },
};
