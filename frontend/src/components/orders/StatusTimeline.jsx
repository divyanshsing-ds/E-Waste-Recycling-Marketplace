import { CheckCircle2Icon } from 'lucide-react'
import clsx from 'clsx'
import { memo } from 'react'

const StatusTimeline = ({ status }) => {
  const steps = [
    { id: 'pending', label: 'Order Created' },
    { id: 'in_transit', label: 'In Transit' },
    { id: 'picked_up', label: 'Item Recieved' },
    { id: 'completed', label: 'Recycling Done' },
  ]

  const currentIndex = steps.findIndex(s => s.id === status)

  return (
    <div className="flex flex-col gap-10">
       {steps.map((step, index) => (
          <div key={step.id} className="flex gap-6 group">
             <div className="flex flex-col items-center">
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center p-0.5 transition-all text-xs border-2 shadow-2xl z-10",
                  index <= currentIndex ? "bg-primary-600 border-primary-500 text-white" : "bg-white border-slate-100 text-slate-300"
                )}>
                   {index < currentIndex ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={clsx("w-0.5 h-16 transition-colors", index < currentIndex ? "bg-primary-600" : "bg-slate-100")} />
                )}
             </div>
             <div className="pt-2">
                <h4 className={clsx("font-extrabold text-lg transition-colors", index <= currentIndex ? "text-slate-900" : "text-slate-400 font-bold")}>
                  {step.label}
                </h4>
                {index === currentIndex && (
                  <p className="text-sm text-slate-500 font-medium animate-in slide-in-from-left-2 duration-700">Currently in this stage.</p>
                )}
             </div>
          </div>
       ))}
    </div>
  )
}

export default memo(StatusTimeline)
