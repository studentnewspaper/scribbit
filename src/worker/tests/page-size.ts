import { pageHeight, pageWidth } from "../config";
import { fail, pass, Result, Test } from "../test";

const expectedSize = makeSize(pageWidth, pageHeight);

export const test: Test = {
  name: "Page size",
  description: `Ensures page is ${expectedSize}`,
  exec: (doc, ctx) => {
    const problems: Result[] = [];

    for (let i = 0; i < ctx.pages.length; i++) {
      const page = doc.pages[i];

      const pageNumber = page.index + 1;
      if (page.width == pageWidth && page.height == pageHeight) continue;

      const actualSize = makeSize(page.width, page.height);
      problems.push(
        fail(
          `Page ${pageNumber} is the wrong size. Expected <output>${expectedSize}</output>, but document is <output>${actualSize}</output>`
        )
      );
    }

    if (problems.length == 0) problems.push(pass());

    return problems;
  },
};

function makeSize(w: number, h: number): string {
  return [w, h].map((x) => `${x}mm`).join(" x ");
}
