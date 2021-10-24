import clsx from "clsx";
import React, {
  FC,
  Fragment,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { flagConfig, makePageFilename } from "../lib/utils";
import { useValidator } from "../lib/useValidator";
import type { ResultWithInfo } from "../worker/worker";
import { Flag, PageInfo, TestInput } from "../worker/test";
import Button from "../components/Button";
import { Disclosure } from "@headlessui/react";

export type ResultGroupProps = {
  flag: Flag;
  results: ResultWithInfo[];
} & Omit<HTMLAttributes<HTMLElement>, "results">;

export const ResultGroup: FC<ResultGroupProps> = ({
  flag,
  results,
  ...props
}) => {
  const flagMeta = flagConfig[flag];

  return (
    <Disclosure
      {...props}
      as="div"
      defaultOpen={flagConfig[flag].open ?? false}
      className={clsx(
        "border shadow-sm rounded overflow-hidden",
        props.className
      )}
    >
      <Disclosure.Button className="w-full flex flex-row justify-between text-xl p-4 bg-gray-50 hover:bg-gray-100">
        <div className="font-bold">{flagMeta.groupName}</div>
        <div className="tabular-nums">{results.length}</div>
      </Disclosure.Button>
      <Disclosure.Panel
        className="grid gap-x-3 gap-y-3 p-4 select-text"
        style={{ gridTemplateColumns: `25% 75%` }}
      >
        {results.map((result, i) => {
          return (
            <Fragment key={i}>
              <div className="flex flex-row items-baseline">
                <div className="flex-shrink-0">{result.name}</div>
                <div className="flex-grow border-b border-dotted ml-3 min-w-[30px]"></div>
              </div>
              <div>
                {result.message != null ? (
                  <span dangerouslySetInnerHTML={{ __html: result.message }} />
                ) : (
                  <span className="text-gray-300 italic">No output</span>
                )}
              </div>
            </Fragment>
          );
        })}
      </Disclosure.Panel>
    </Disclosure>
  );
};

export type ResultsPageProps = {
  results: ResultWithInfo[];
  ctx: TestInput;
  filename: string;
  onReset: () => void;
  pages: PageInfo[];
} & Omit<HTMLAttributes<HTMLElement>, "results">;

export const ResultsPage: FC<ResultsPageProps> = ({
  results,
  ctx,
  pages,
  filename,
  onReset,
  ...props
}) => {
  const steps = (() => {
    const steps: ReactNode[] = [];

    const pageFilename = makePageFilename(pages);

    steps.push(
      <>
        Open the <output>{pageFilename}</output> folder in the files tab of the
        Copyediting channel.
        <br />
        <span className="italic text-gray-600">
          e.g. Editions &rarr; 2021 Sep - Dec &rarr; Edition 4 &rarr;{" "}
          {pageFilename}
        </span>
      </>
    );

    steps.push(
      <>
        Drag and drop <output>{pageFilename}.sla</output> into the folder, such
        that it replaces the original file if one exists. Do not create any
        aditional folders.
      </>
    );

    if (ctx.hasImages) {
      steps.push(
        <>
          If you have not added or modified any images in your edit, you can
          skip this step. Open the <output>images</output> folder in the page
          folder in Teams. Open the same folder on your computer (where Scribus
          collected for output). Drag and drop the images from your computer
          into the images folder. Do not drag and drop the images folder{" "}
          <i>itself</i>, only the contents.
        </>
      );
    }

    steps.push(
      <>
        Open the tracking manifest spreadsheet, and remove your name from the{" "}
        <output>Locked by</output> column. Increase the status by one.
      </>
    );

    return steps;
  })();

  return (
    <div {...props} className={clsx("", props.className)}>
      <header className="px-5 py-6">
        <div className="leading-none text-gray-500">Test results for</div>
        <div className="text-4xl font-bold tracking-tight mt-1">{filename}</div>
      </header>
      <div className="px-5 space-y-5">
        {[...Object.entries(flagConfig)]
          .map(([flag, config]) => ({
            flag: flag as Flag,
            results: results.filter((r) => r.status == flag),
          }))
          .filter(({ results }) => results.length > 0)
          .map(({ flag, results }) => (
            <ResultGroup key={flag} flag={flag} results={results} />
          ))}
      </div>
      <div className="px-6 mt-6">
        <div className="font-bold text-lg">Next steps</div>
        <div className="text-gray-600">
          If you are ready to submit your edits, follow these steps:
        </div>
        <ol className="mt-2 list-decimal space-y-2 marker:text-blue-600 marker:font-semibold">
          {steps.map((step, i) => (
            <li key={i} className="ml-8">
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="px-6 mt-6 pb-6">
        <Button
          autoFocus
          onClick={() => {
            onReset();
          }}
        >
          New file
        </Button>
      </div>
    </div>
  );
};

export type ResultsPageWrapperProps = {
  file: File;
  pages: PageInfo[];
  onReset: () => void;
};

enum LoadingStatus {
  LoadingText,
  LoadingResults,
  NotLoading,
}

export const ResultsPageWrapper: FC<ResultsPageWrapperProps> = ({
  file,
  pages,
  onReset,
}) => {
  const validator = useValidator();
  const [results, setResults] = useState<ResultWithInfo[] | null>(null);
  const [ctx, setCtx] = useState<TestInput | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LoadingText);

  useEffect(function loadResults() {
    (async () => {
      if (validator == null)
        throw new Error("Validator was null when required");

      setLoadingStatus(LoadingStatus.LoadingText);
      const fileContents = await file.text();

      setLoadingStatus(LoadingStatus.LoadingResults);
      const { results, ctx } = await validator.analyseFile(fileContents, {
        pages,
        filename: file.name,
      });

      setResults(results);
      setCtx(ctx);
      setLoadingStatus(LoadingStatus.NotLoading);
    })();
  }, []);

  return loadingStatus == LoadingStatus.NotLoading ? (
    <ResultsPage
      results={results!}
      ctx={ctx!}
      pages={pages}
      filename={file.name}
      onReset={onReset}
    />
  ) : (
    <div className="">
      <header className="px-5 py-6">
        <div className="leading-none text-blue-600">Currently testing</div>
        <div className="text-4xl font-bold tracking-tight mt-1">
          {file.name}
        </div>
      </header>
    </div>
  );
};

export default ResultsPageWrapper;
