import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700 pl-1">{label}</label>}
      <input 
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-red-600 text-xs pl-1 font-medium">{error}</span>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
