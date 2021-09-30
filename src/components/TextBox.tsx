import clsx from "clsx";
import React, { FC, InputHTMLAttributes } from "react";

export type TextBoxProps = {} & InputHTMLAttributes<HTMLInputElement>;

export const TextBox: FC<TextBoxProps> = ({ children, ...props }) => {
  return (
    <input
      {...props}
      className={clsx("rounded py-2 px-3 shadow-sm border", props.className)}
    />
  );
};

export default TextBox;
