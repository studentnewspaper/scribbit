import clsx from "clsx";
import React, { FC, FormEvent, HTMLAttributes, useState } from "react";
import Button from "../components/Button";
import TextBox from "../components/TextBox";
import { isTruthy, parsePageFilename } from "../lib/utils";
import { PageInfo } from "../worker/test";

const sections = [
  "Cover",
  "News",
  "Opinion",
  "Editorial",
  "Features",
  "Voices",
  "Art",
  "Film & TV",
  "Music",
  "Theatre",
  "Literature",
  "Lifestyle",
  "Horoscopes",
  "Puzzles",
  "Sport",
  "Interview Special",
  "Contents",
].sort((a, b) => a.localeCompare(b));

export type PagePropertiesProps = {
  ctx: PageInfo;
  setCtx: (ctx: PageInfo) => void;
} & HTMLAttributes<HTMLElement>;

export const PageProperties: FC<PagePropertiesProps> = ({
  ctx,
  setCtx,
  ...props
}) => {
  const { number, section } = ctx;
  const [tmpValue, setTmp] = useState(ctx.number.toString());

  return (
    <div
      {...props}
      className={clsx("grid gap-y-1 gap-x-4", props.className)}
      style={{ gridTemplateColumns: `minmax(0, auto) minmax(0, 1fr)` }}
    >
      <div className="font-medium">Page number</div>
      <div className="font-medium">Section name</div>
      <div>
        <TextBox
          className="w-full"
          type="number"
          min="1"
          max="32"
          step="1"
          value={tmpValue}
          onChange={(e) => {
            const value = e.currentTarget.value;

            if (!isNaN(parseInt(value))) {
              setCtx({ ...ctx, number: parseInt(value) });
            }

            setTmp(value);
          }}
          onBlur={(e) => {
            const newValue = parseInt(tmpValue) || 0;
            setCtx({ ...ctx, number: newValue });
            setTmp(newValue.toString());
          }}
        />
      </div>
      <div>
        <TextBox
          className="w-full"
          list="sections"
          value={section}
          onChange={(e) => {
            setCtx({ ...ctx, section: e.currentTarget.value });
          }}
        />
        <datalist id="sections">
          {sections.map((section) => (
            <option key={section}>{section}</option>
          ))}
        </datalist>
      </div>
    </div>
  );
};

export type SettingsPageProps = {
  onDone: (ctxs: PageInfo[]) => void;
  filename: string;
} & HTMLAttributes<HTMLElement>;

export const SettingsPage: FC<SettingsPageProps> = ({
  onDone,
  filename,
  ...props
}) => {
  const [initialPageInfo] = useState(parsePageFilename(filename) ?? []);

  const [isDouble, setIsDouble] = useState(initialPageInfo.length == 2);
  const [lhsCtx, setLhsCtx] = useState<PageInfo>(
    initialPageInfo[0] ?? { number: 0, section: "" }
  );
  const [rhsCtx, setRhsCtx] = useState<PageInfo>(
    initialPageInfo[1] ?? { number: 0, section: "" }
  );

  const errors = (() => {
    const result: string[] = [];

    [lhsCtx, isDouble && rhsCtx]
      .filter(isTruthy)
      .forEach(({ number, section }) => {
        const validNumber = number >= 1 && number <= 32;
        if (!validNumber) {
          result.push(`Page number ${number} is invalid (1 ≤ n ≤ 32)`);
        }

        const validSection = section.trim().length > 0;
        if (!validSection) {
          result.push(`Section name required for page ${number}`);
        }
      });

    if (isDouble) {
      const isLhsEven = lhsCtx.number % 2 == 0;
      const doesRhsFollowLhs = rhsCtx.number - lhsCtx.number == 1;
      if (!isLhsEven) {
        result.push(
          `First page must be even, as it is on the left hand side of the paper`
        );
      }

      if (isLhsEven && !doesRhsFollowLhs) {
        result.push(
          `Second page must come exactly after the first page (${
            rhsCtx.number
          } ≠ ${lhsCtx.number + 1})`
        );
      }
    }

    return result;
  })();

  const warnings = (() => {
    return [lhsCtx.section, isDouble && rhsCtx.section]
      .filter(isTruthy)
      .filter((section) => section.length > 0)
      .filter((section) => !sections.includes(section))
      .map((section) => `${section} is not a preset section name`);
  })();

  const canSubmit = errors.length == 0;
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) return;
    if (!isDouble) {
      onDone([lhsCtx]);
    } else {
      onDone([lhsCtx, rhsCtx]);
    }
  }

  return (
    <div {...props} className={clsx("h-full", props.className)}>
      <form onSubmit={onSubmit} className="h-full relative">
        <header className="px-5 py-6">
          <div className="text-4xl font-bold tracking-tight">Page settings</div>
        </header>

        <div className="px-5 py-6 border-t">
          <div className="flex flex-row items-center space-x-2 font-medium">
            <input
              id="isDoublePage"
              type="checkbox"
              checked={isDouble}
              onChange={(e) => {
                setIsDouble(e.currentTarget.checked);
              }}
              autoFocus={initialPageInfo == null}
            />
            <label htmlFor="isDoublePage">Double spread</label>
          </div>

          <div className="mt-4 space-y-3">
            <PageProperties ctx={lhsCtx} setCtx={setLhsCtx} />
            {isDouble && <PageProperties ctx={rhsCtx} setCtx={setRhsCtx} />}
          </div>
          {warnings.length > 0 && (
            <div className="mt-8 bg-yellow-100 rounded p-4 border border-yellow-400">
              <div className="font-bold text-lg">Warnings</div>
              <ul className="list-disc mt-1 space-y-0.5">
                {warnings.map((warning, i) => (
                  <li key={i} className="ml-7">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.length > 0 && (
            <div className="mt-4 bg-red-100 rounded p-4 border border-red-400">
              <div className="font-bold text-lg">Errors</div>
              <ul className="list-disc mt-1 space-y-0.5">
                {errors.map((error, i) => (
                  <li key={i} className="ml-7">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button
          type="submit"
          className="absolute bottom-8 right-8"
          disabled={!canSubmit}
          autoFocus={initialPageInfo != null}
        >
          Next
        </Button>
      </form>
    </div>
  );
};

export default SettingsPage;
