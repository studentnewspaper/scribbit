import { fail, pass, Test } from "../test";

export const test: Test = {
  name: "Template version",
  description:
    "Ensures pages have been produced with the most up-to-date base template",
  exec: (doc, ctx) => {
    const expectedDocDate = import.meta.env.VITE_EDITION_DATE;
    if (expectedDocDate == null) {
      throw new Error("Expected edition date not set");
    }

    if (doc.root.DOCDATE != expectedDocDate) {
      return [
        fail("Document not created from base templates for this edition"),
      ];
    }

    return [pass()];
  },
};
