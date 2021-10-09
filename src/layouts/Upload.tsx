import clsx from "clsx";
import React, { FC, HTMLAttributes, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export type UploadPageProps = {
  onDone: (file: File) => void;
} & HTMLAttributes<HTMLElement>;

export const UploadPage: FC<UploadPageProps> = ({ onDone, ...props }) => {
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
    if (raw == null || raw == "undefined" || raw == "") return null;
    return `Build ${raw.slice(0, 8)}`;
  })();

  return (
    <div
      {...getRootProps()}
      className={clsx("h-full cursor-pointer relative", props.className)}
    >
      <div className="h-full flex flex-col items-center justify-center text-center">
        <input {...getInputProps()} />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          {isDragActive ? "Drop" : "Upload"} Scribus file
        </h1>
        <div className="mt-2 md:mt-3 text-gray-500">
          Click to browse, or drop file here.
        </div>
      </div>
      <div className="absolute bottom-7 right-8 text-right text-gray-400">
        {commit ?? "Development build"}
      </div>
    </div>
  );
};

export default UploadPage;
