import { Link } from 'react-router-dom'
import Button from './Button'

const EmptyState = ({ title, description, actionLink, actionLabel }) => {
  return (
    <div className="glass-card-dark p-20 text-center border border-white/10 bg-[#050505]/80 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem]">
      <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-700">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">{title}</h3>
      <p className="text-teal-500/70 mb-8 max-w-sm mx-auto font-bold uppercase tracking-[0.2em] text-[10px]">{description}</p>
      {actionLink && (
        <Link to={actionLink}>
          <Button variant="primary" className="px-10 text-xs tracking-widest">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}

export default EmptyState
