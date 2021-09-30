import { pageHeight, pageWidth } from "../config";
import { fail, pass, Result, Test } from "../test";

const expectedSize = makeSize(pageWidth, pageHeight);

export const test: Test = {
  name: "Page size",
  description: `Ensures page is ${expectedSize}`,
  exec: (doc) => {
    const problems: Result[] = [];

    for (const page of doc.pages) {
      const pageNumber = page.index + 1;
      if (page.width == pageWidth && page.height == pageHeight) continue;

      const actualSize = makeSize(page.width, page.height);
      problems.push(
        fail(`Page ${pageNumber} is the wrong size`, [expectedSize, actualSize])
      );
    }

    if (problems.length == 0) problems.push(pass());

    return problems;
  },
};

function makeSize(w: number, h: number): string {
  return [w, h].map((x) => `${x}mm`).join(" x ");
}
