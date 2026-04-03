import { Link } from 'react-router-dom'
import { MapPinIcon, TagIcon, StarIcon, ArrowRightIcon } from 'lucide-react'
import clsx from 'clsx'
import { memo } from 'react'

const ListingCard = ({ listing }) => {
  const statusColors = {
    open: 'bg-teal-500/10 text-teal-400 border border-teal-500/30',
    closed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    completed: 'bg-white/[0.05] text-slate-400 border border-white/10',
  }

  return (
    <Link 
      to={`/listings/${listing.id}`} 
      className="glass-card-dark group bg-[#050505]/80 backdrop-blur-xl border border-white/10 hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all overflow-hidden flex flex-col h-full rounded-[2rem]"
    >
      <div className="relative h-56 overflow-hidden bg-[#0A0A0A]">
        <img 
          src={listing.image_url || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800'} 
          alt={listing.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 filter brightness-90 saturate-50 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
        <div className="absolute top-4 right-4 z-10">
          <span className={clsx('px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-lg flex items-center shadow-lg', statusColors[listing.status])}>
            {listing.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-inner">
            {listing.category}
          </span>
          <span className="text-white/20 text-xs">•</span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{listing.condition} cond.</span>
        </div>

        <h3 className="text-lg font-black text-white group-hover:text-teal-400 transition-colors mb-2 line-clamp-1 tracking-tighter">
          {listing.title}
        </h3>
        
        <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-4">
          <MapPinIcon size={14} className="text-teal-500" />
          <span className="line-clamp-1">{listing.pickup_address}</span>
        </div>

        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between group-hover:border-teal-500/20 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden">
               {listing.user.avatar_url ? <img src={listing.user.avatar_url} className="w-full h-full object-cover" /> : <span className="text-teal-500 font-black text-xs">{listing.user.full_name[0]}</span>}
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-black text-slate-300 leading-none">{listing.user.full_name}</span>
                <div className="flex items-center gap-1 mt-1">
                   <StarIcon size={10} className="fill-emerald-400 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                   <span className="text-[10px] font-bold text-slate-500">{listing.user.vendor_score} Trust</span>
                </div>
             </div>
           </div>
           
           <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-[#050505] group-hover:border-teal-400 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]">
             <ArrowRightIcon size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
           </div>
        </div>
      </div>
    </Link>
  )
}

export default memo(ListingCard)
