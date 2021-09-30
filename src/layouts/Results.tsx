import clsx from "clsx";
import React, {
  FC,
  Fragment,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { flagConfig, FlagImportance } from "../lib/utils";
import { useValidator } from "../lib/useValidator";
import type { ResultWithInfo } from "../worker/worker";
import { Flag, PageInfo } from "../worker/test";

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

  const [expanded, isExpanded] = useState(
    [FlagImportance.High, FlagImportance.Medium].includes(flagMeta.importance)
  );

  return (
    <div
      {...props}
      className={clsx(
        "border shadow-sm rounded overflow-hidden",
        props.className
      )}
    >
      <div className="flex flex-row justify-between text-xl p-4 bg-gray-50">
        <div className="font-bold">{flagMeta.groupName}</div>
        <div className="tabular-nums">{results.length}</div>
      </div>
      <div
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
      </div>
    </div>
  );
};

export type ResultsPageProps = {
  file: File;
  PageInfos: PageInfo[];
} & HTMLAttributes<HTMLElement>;

enum LoadingStatus {
  LoadingText,
  LoadingResults,
  NotLoading,
}

export const ResultsPage: FC<ResultsPageProps> = ({
  file,
  PageInfos,
  ...props
}) => {
  const validator = useValidator();
  const [results, setResults] = useState<ResultWithInfo[] | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LoadingText);

  useEffect(function loadResults() {
    (async () => {
      if (validator == null)
        throw new Error("Validator was null when required");

      setLoadingStatus(LoadingStatus.LoadingText);
      const fileContents = await file.text();

      setLoadingStatus(LoadingStatus.LoadingResults);
      const results = await validator.analyseFile(fileContents, {
        pages: PageInfos,
        filename: file.name,
      });

      setResults(results);
      setLoadingStatus(LoadingStatus.NotLoading);
    })();
  }, []);

  return (
    <div {...props} className={clsx("", props.className)}>
      <header className="px-5 py-6">
        <div className="leading-none text-gray-500">Test results for</div>
        <div className="text-4xl font-bold tracking-tight">{file.name}</div>
      </header>
      {loadingStatus == LoadingStatus.NotLoading && results != null && (
        <div className="px-5 space-y-5">
          {[...Object.values(Flag)]
            .map((flag) => ({
              flag: flag as Flag,
              results: results.filter((r) => r.status == flag),
            }))
            .filter(({ results }) => results.length > 0)
            .sort(
              (a, b) =>
                flagConfig[a.flag].importance - flagConfig[b.flag].importance
            )
            .map(({ flag, results }) => (
              <ResultGroup key={flag} flag={flag} results={results} />
            ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
