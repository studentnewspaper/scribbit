import clsx from "clsx";
import React, { FC, HTMLAttributes, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useOffline } from "../lib/useOffline";

export type UploadPageProps = {
  onDone: (file: File) => void;
} & HTMLAttributes<HTMLElement>;

export const UploadPage: FC<UploadPageProps> = ({ onDone, ...props }) => {
  const { needsRefresh, offlineReady, update } = useOffline();
  useEffect(
    function refreshIfNeeded() {
      if (needsRefresh) update();
    },
    [needsRefresh]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".sla",
    multiple: false,
    onDrop: (files) => {
      if (files.length != 1) return;
      onDone(files[0]);
    },
  });

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
      <div
        className={clsx(
          "absolute bottom-8 text-blue-400 transition-all",
          offlineReady ? "opacity-100" : "opacity-0"
        )}
      >
        App available offline
      </div>
    </div>
  );
};

export default UploadPage;
