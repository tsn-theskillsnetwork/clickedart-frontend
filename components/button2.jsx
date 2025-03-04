import React from 'react';

export default function Button2({
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
    xs: 'text-xs py-2 px-2',
    sm: 'text-sm py-3 px-3',
    base: 'text-md py-3.5 px-4',
    lg: 'text-lg py-4 px-5',
    xl: 'text-xl py-5 px-6',
  };

  const variantClasses = {
    filled:
      'bg-[#53798C] text-white rounded-lg hover:bg-[#42606F] active:bg-[#42606F] focus:ring focus:ring-[#D4A01EBA] focus:outline-none disabled:bg-[#B0B0B0] disabled:text-white disabled:cursor-not-allowed',
    pill:
      'bg-[#53798C] text-white rounded-full hover:bg-[#42606F] active:bg-[#42606F] focus:ring focus:ring-[#D4A01EBA] focus:outline-none disabled:bg-[#B0B0B0] disabled:text-white disabled:cursor-not-allowed',
    secondary:
      'border border-[#53798C] text-[#111827] hover:bg-secondary-light active:bg-secondary-dark focus:ring focus:ring-[#D4A01EBA] focus:outline-none disabled:bg-[#B0B0B0] disabled:text-white disabled:cursor-not-allowed',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      onClick={state !== 'disabled' ? onClick : undefined}
      disabled={state === 'disabled' || state === 'loading'} // ✅ Fix applied
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
