import clsx from "clsx";
import React, { FC, HTMLAttributes, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useOffline } from "../lib/useOffline";

export type UploadPageProps = {
  onDone: (file: File) => void;
} & HTMLAttributes<HTMLElement>;

export const UploadPage: FC<UploadPageProps> = ({ onDone, ...props }) => {
  const { offlineReady } = useOffline();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".sla",
    multiple: false,
    onDrop: (files) => {
      if (files.length != 1) return;
      onDone(files[0]);
    },
  });

  const commit = ((): string | null => {
    const raw = import.meta.env.VITE_COMMIT;
    if (raw == null || raw == "undefined") return null;
    return `Build ${raw.slice(0, 8)}`;
  })();

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "h-full flex flex-col items-center justify-center text-center cursor-pointer relative",
        props.className
      )}
    >
      <input {...getInputProps()} />
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
        {isDragActive ? "Drop" : "Upload"} Scribus file
      </h1>
      <div className="mt-2 md:mt-4 text-gray-500">
        Click to browse, or drop file here.
      </div>
      <div className="absolute bottom-8">
        <div
          className={clsx(
            "text-blue-600 transition-opacity",
            offlineReady ? "opacity-100" : "opacity-0"
          )}
        >
          App available offline
        </div>
        <div className="space-x-1 text-gray-300">
          <span>{commit ?? "Development build"}</span>
          <span>&mdash;</span>
          <span>Nicholas Bush</span>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
