import React from "react";
import { cn } from "@/lib/utils";

export interface ThemedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const ThemedInput = React.forwardRef<HTMLInputElement, ThemedInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={props.type || "text"}
            className={cn(
              "input input-bordered w-full",
              error && "input-error",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

ThemedInput.displayName = "ThemedInput";

export { ThemedInput };
