import { makePageNumberText } from "../../lib/utils";
import {
  pageHeaderSearchHeight,
  pageMargin,
  pageNumberSearchWidth,
  pageWidth,
} from "../config";
import { ObjectType } from "../document";
import { fail, pass, Result, Test } from "../test";

export const test: Test = {
  name: "Page number",
  description: "Ensures pages have the correct page numbers",
  exec: (doc, ctx) => {
    const problems: Result[] = [];

    for (let i = 0; i < ctx.pages.length; i++) {
      if (i >= doc.pages.length) continue;

      const pageCtx = ctx.pages[i];
      const page = doc.pages[i];

      const isLhs = pageCtx.number % 2 == 0;
      const expectedNumberText = makePageNumberText(pageCtx.number);

      const hasNumber = doc.objects
        .filter((o) => o.type == ObjectType.Text)
        .filter((o) => o.page == i)
        .filter((o) => o.y <= pageHeaderSearchHeight)
        .filter((o) => o.width <= pageNumberSearchWidth)
        .filter((o) => isInPageNumberArea(o.x, isLhs))
        .some((o) => {
          if (o.text == null) return false;

          const fullText = o.text.map((t) => t.text).join("");
          return fullText.trim() == expectedNumberText;
        });

      if (hasNumber) continue;

      const expectedSide = isLhs ? "left" : "right";
      problems.push(
        fail(
          `Page ${
            page.index + 1
          } does not have a ${expectedNumberText} page number on ${expectedSide}`
        )
      );
    }

    if (problems.length == 0) problems.push(pass());

    return problems;
  },
};

function isInPageNumberArea(x: number, isLhs: boolean): boolean {
  const lhsMargin = pageMargin;
  const rhsMargin = pageWidth - pageMargin;

  if (isLhs) {
    return isInBounds(x, [lhsMargin - 2, lhsMargin + 2]);
  } else {
    return isInBounds(x, [
      rhsMargin - pageNumberSearchWidth - 2,
      rhsMargin - pageNumberSearchWidth + 2,
    ]);
  }
}

function isInBounds(x: number, [lower, upper]: number[]): boolean {
  return x >= lower && x <= upper;
}
