import { ObjectType } from "../document";
import { info, fail, Result, Test, pass } from "../test";

export const test: Test = {
  name: "Relative images",
  description: `Ensures images have been collected for output`,
  exec: (doc) => {
    const messages: Result[] = [];
    const problems: Result[] = [];
    const images = doc.objects.filter((o) => o.type == ObjectType.Image);

    for (const { src, x, y } of images) {
      const location = [x, y].join(", ");

      if (src == null) {
        messages.push(
          info(`The image at (${location}) has no associated file`)
        );
        continue;
      }

      const hasCollectedForOutput = src.startsWith("images/");
      if (hasCollectedForOutput) continue;

      const sourceParts = src.split("/");
      const filename = sourceParts[sourceParts.length - 1];

      problems.push(
        fail(
          `The image ${filename} has not been collected for output and will appear blank when opened`
        )
      );
    }

    if (problems.length == 0) problems.push(pass());

    return [...messages, ...problems];
  },
};
