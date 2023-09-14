import React from "react";

// project imports
import clsxm from "../utils/mergeClass";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: React.ReactNode;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  startIcon,
  endIcon,
  ...others
}) => {
  return (
    <button
      className={clsxm(
        `flex items-center gap-1 bg-green-600 hover:bg-green-700 transition-colors duration-200 cursor-pointer px-3 py-1 outline-none border-none rounded-lg text-lg text-white`,
        className
      )}
      {...others}
    >
      {startIcon && <span className="flex">{startIcon}</span>}

      {children && children}

      {endIcon && <span className="flex">{endIcon}</span>}
    </button>
  );
};

export default Button;
