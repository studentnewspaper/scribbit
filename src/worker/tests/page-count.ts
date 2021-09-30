import { fail, pass, Test } from "../test";

export const test: Test = {
  name: "Page count",
  description: "Ensures the correct number of pages are present",
  exec: (doc, ctx) => {
    if (doc.pages.length == ctx.pages.length) return [pass()];

    return [
      fail(`Incorrect number of pages`, [
        ctx.pages.length.toString(),
        doc.pages.length.toString(),
      ]),
    ];
  },
};
