import { forwardRef } from 'react'
import clsx from 'clsx'

const Button = forwardRef(({ variant = 'primary', className, disabled, loading, children, ...props }, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 border border-emerald-400',
    secondary: 'bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200 shadow-sm hover:bg-white hover:border-emerald-200 hover:text-emerald-700 hover:-translate-y-0.5',
    outline: 'bg-transparent text-emerald-600 border border-emerald-500/30 hover:bg-emerald-50 hover:border-emerald-500 hover:-translate-y-0.5',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-[0_8px_16px_rgba(239,68,68,0.2)] hover:shadow-[0_12px_24px_rgba(239,68,68,0.3)] border border-red-400 hover:-translate-y-0.5',
  }

  return (
    <button 
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:translate-y-0',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
