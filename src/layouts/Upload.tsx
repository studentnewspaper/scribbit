import clsx from "clsx";
import React, { FC, HTMLAttributes } from "react";
import { useDropzone } from "react-dropzone";

export type UploadPageProps = {
  onDone: (file: File) => void;
} & HTMLAttributes<HTMLElement>;

export const UploadPage: FC<UploadPageProps> = ({ onDone, ...props }) => {
  const { getRootProps, getInputProps, isDragActive, draggedFiles } =
    useDropzone({
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
        "h-full flex flex-col items-center justify-center text-center group",
        props.className
      )}
    >
      <input {...getInputProps()} />
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter group-hover:text-blue-700 transition-colors">
        {isDragActive ? "Drop" : "Upload"} Scribus file
      </h1>
      <p className="mt-2 md:mt-4 text-gray-500">
        Click to browse, or drop file here.
      </p>
    </div>
  );
};

export default UploadPage;
