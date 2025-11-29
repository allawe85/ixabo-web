import React from 'react';

const iXaboButton = ({ children, variant = 'primary', className = '', ...props }) => {
  
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 cursor-pointer";
  
  const variants = {
    primary: "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-0.5",
    
    secondary: "bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-primary/5",
    
    ghost: "text-ui-gray hover:text-brand-primary hover:bg-brand-primary/5",
    
    dark: "bg-ui-dark text-white hover:bg-black"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default iXaboButton;