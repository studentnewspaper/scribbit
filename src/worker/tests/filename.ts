import { makePageFilename } from "../../lib/utils";
import { fail, pass, Test } from "../test";

export const test: Test = {
  name: "Filename",
  description: "Ensures filename is correct",
  exec: (doc, ctx) => {
    const expectedFilename = makePageFilename(ctx.pages);
    if (ctx.filename == expectedFilename) return [pass()];

    return [
      fail(
        `Expected file to be called <output>${expectedFilename}</output>, not <output>${ctx.filename}</output>`
      ),
    ];
  },
};
