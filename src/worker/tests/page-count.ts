import { fail, pass, Test } from "../test";

export const test: Test = {
  name: "Page count",
  description: "Ensures the correct number of pages are present",
  exec: (doc, ctx) => {
    if (doc.pages.length == ctx.pages.length) return [pass()];
    const expected = ctx.pages.length;
    const actual = doc.pages.length;

    return [
      fail(
        `Incorrect number of pages. Expected ${expected}, but document has ${actual}`
      ),
    ];
  },
};
