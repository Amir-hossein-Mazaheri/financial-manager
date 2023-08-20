import React from "react";

// project imports
import clsxm from "../utils/mergeClass";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...others }) => {
  return (
    <input
      className={clsxm(
        "bg-transparent outline-none border border-gray-600 border-solid px-4 py-3 rounded-md text-white",
        className
      )}
      {...others}
    />
  );
};

export default Input;
