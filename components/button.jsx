import React from 'react';

export default function Button({
  children = 'Button text',
  size = 'base',       
  variant = 'filled', 
  state = 'default',   
  icon = null,        
  onClick,          
}) {
  const baseClasses =
    'flex items-center justify-center font-semibold transition duration-200 ease-in-out'; 

  const sizeClasses = {
    xs: 'text-xs py-1 px-2',
    sm: 'text-sm py-1.5 px-3',
    base: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-5',
    xl: 'text-xl py-3.5 px-6',
  };

  const variantClasses = {
    filled: 'bg-primary text-white rounded hover:bg-primary-dark active:bg-primary-darker',
    pill: 'bg-primary text-white rounded-full hover:bg-primary-dark active:bg-primary-darker',
    secondary: 'border border-secondary text-secondary hover:bg-secondary-light active:bg-secondary-dark',
  };

  const stateClasses = {
    default: '',
    hover: '',
    focus: 'focus:ring focus:ring-focus focus:outline-none',
    disabled: 'bg-disabled text-gray-400 cursor-not-allowed',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        state === 'disabled' ? stateClasses['disabled'] : stateClasses[state]
      }`}
      onClick={state !== 'disabled' ? onClick : undefined} 
      disabled={state === 'disabled'}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
