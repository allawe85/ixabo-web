import React from 'react';
import { cn } from "@/lib/utils";

const IxaboInput = React.forwardRef(({ label, type = "text", error, className = "", containerClassName = "", ...props }, ref) => {
  return (
    <div className={cn("w-full space-y-2 relative z-10", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-ui-dark">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          // FIX: Added 'border-gray-300', 'bg-white', and 'z-20' to ensure visibility and clickability
          "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-ui-dark relative z-20",
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

IxaboInput.displayName = "IxaboInput";

export default IxaboInput;