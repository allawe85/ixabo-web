import React from 'react';

const iXaboInput = ({ label, type = "text", error, className = "", ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-ui-dark">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ui-dark
          focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
          transition-all duration-200 placeholder:text-gray-400
          ${error ? 'border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default iXaboInput;