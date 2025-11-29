import React from 'react';
import { cn } from "@/lib/utils";

const iXaboInput = React.forwardRef(({ label, type = "text", error, className = "", containerClassName = "", ...props }, ref) => {
  return (
    <div className={cn("w-full space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-ui-dark">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ui-dark",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
          "transition-all duration-200 placeholder:text-gray-400",
          error ? "border-red-500 focus:ring-red-200" : "",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

iXaboInput.displayName = "iXaboInput";

export default iXaboInput;