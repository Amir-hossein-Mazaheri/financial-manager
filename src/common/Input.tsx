import React, { forwardRef } from "react";

// third party
import { useFormContext } from "react-hook-form";

// project imports
import clsxm from "../utils/mergeClass";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, ...others }, ref) => {
    const formProvider = useFormContext();

    return (
      <div className={clsxm("relative w-full flex", wrapperClassName)}>
        <input
          ref={ref}
          className={clsxm(
            "relative flex-grow bg-transparent outline-none border border-gray-600 border-solid px-4 py-3 rounded-md text-white",
            className
          )}
          {...others}
        />

        {formProvider?.formState.errors[others.name as string] && (
          <p className="text-red-500 text-sm absolute bottom-0 right-0 translate-y-full -mb-1">
            {formProvider?.formState?.errors?.[
              (others?.name as string) ?? ""
            ]?.message?.toString()}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
