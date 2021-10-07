import { pageHeaderSearchHeight } from "../config";
import { ObjectType } from "../document";
import { fail, pass, Result, Test } from "../test";

export const test: Test = {
  name: "Section name",
  description: "Ensures pages have the correct section name",
  exec: (doc, ctx) => {
    const problems: Result[] = [];

    for (const page of doc.pages) {
      const pageNumber = page.index + 1;
      const sectionName = ctx.pages[page.index].section;

      const hasName = doc.objects
        .filter((o) => o.type == ObjectType.Text)
        .filter((o) => o.page == page.index)
        .filter((o) => o.y <= pageHeaderSearchHeight)
        .some((o) => {
          if (o.text == null) return false;

          const fullText = o.text.map((t) => t.text).join("");
          return normalise(fullText) == normalise(sectionName);
        });

      if (hasName) continue;
      problems.push(
        fail(
          `Page ${pageNumber} does not have a <output>${sectionName}</output> header`
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
