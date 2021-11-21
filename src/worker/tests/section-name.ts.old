import { pageHeaderSearchHeight } from "../config";
import { ObjectType } from "../document";
import { fail, pass, Result, Test } from "../test";

export const test: Test = {
  name: "Section name",
  description: "Ensures pages have the correct section name",
  exec: (doc, ctx) => {
    const problems: Result[] = [];

    for (let i = 0; i < ctx.pages.length; i++) {
      if (i >= doc.pages.length) continue;

      const pageCtx = ctx.pages[i];
      const page = doc.pages[i];

      const hasName = doc.objects
        .filter((o) => o.type == ObjectType.Text)
        .filter((o) => o.page == page.index)
        .filter((o) => o.y <= pageHeaderSearchHeight)
        .some((o) => {
          if (o.text == null) return false;

          const fullText = o.text.map((t) => t.text).join("");
          return normalise(fullText) == normalise(pageCtx.section);
        });

      if (hasName) continue;
      problems.push(
        fail(
          `Page ${i + 1} does not have a <output>${
            pageCtx.section
          }</output> header`
        )
      );
    }

    if (problems.length == 0) problems.push(pass());

    return problems;
  },
};

function normalise(s: string): string {
  return s.toLowerCase().trim().replaceAll("&amp;", "&");
}
