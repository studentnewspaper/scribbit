import clsx from "clsx";
import React, { FC, ButtonHTMLAttributes } from "react";

export type ButtonProps = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded py-2 px-3 min-w-[120px] border text-center font-bold transition-colors focus-visible:ring-4",
        props.disabled
          ? "bg-gray-100 text-gray-400"
          : "bg-blue-700 hover:bg-blue-600 text-white border-blue-400 shadow-lg",
        props.className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
