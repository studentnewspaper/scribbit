import * as Sentry from "@sentry/react";
import { FallbackRender } from "@sentry/react/esm/errorboundary";
import clsx from "clsx";
import React, { FC, HTMLAttributes } from "react";
import Button from "../components/Button";

export type ErrorPageProps = { error: Error } & HTMLAttributes<HTMLElement>;

export const ErrorPage: FallbackRender = ({
  error,
  componentStack,
  resetError,
}) => {
  return (
    <div className="h-full flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-xl">
        <div className="text-4xl md:text-6xl font-bold tracking-tighter">
          Something broke!
        </div>
        <div className="bg-red-100 rounded p-4 mt-7 shadow-sm">
          <div className="font-bold text-lg text-red-900">{error.name}</div>
          <div className="mt-1">{error.message}</div>
        </div>
        <div className="mt-6">
          This error has been reported to the digital team. Either refresh the
          page or reset the app to try again.
        </div>
        <div className="mt-6">
          <Button
            onClick={() => {
              resetError();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
