import { useState } from 'react'
import { useListings } from '../../hooks/useListings'
import ListingCard from '../../components/listings/ListingCard'
import Button from '../../components/ui/Button'
import { SearchIcon, FilterIcon, MapPinIcon, GhostIcon } from 'lucide-react'

const BrowseListings = () => {
  const [search, setSearch] = useState('')
  const [params, setParams] = useState({ status: 'open' })
  const { data: listings, isLoading } = useListings({ ...params, ...(search ? { search } : {}) })

  const categories = ['all', 'phone', 'laptop', 'tv', 'appliance', 'other']

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
         <div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Hardware Exchange</h1>
            <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px]">Scan for open drops in your sector</p>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative group flex-grow md:flex-grow-0">
               <input 
                 type="text" 
                 placeholder="Scan keywords..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-12 pr-6 py-4 rounded-2xl bg-[#050505]/80 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-teal-500/50 focus:bg-white/[0.05] w-full md:w-80 transition-all font-medium backdrop-blur-md shadow-inner" 
               />
               <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={20} />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
               <FilterIcon size={16} /> Filters
            </button>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
         {categories.map(cat => (
           <button
             key={cat}
             onClick={() => setParams({ ...params, category: cat === 'all' ? null : cat })}
             className={`px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.1em] transition-all duration-300 ${
               (cat === 'all' && !params.category) || params.category === cat
                 ? 'bg-teal-500 text-[#050505] shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-400'
                 : 'bg-[#050505]/60 border border-white/10 text-slate-500 hover:text-teal-400 hover:border-teal-500/30'
             }`}
           >
             {cat}
           </button>
         ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[400px] bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse" />)}
        </div>
      ) : listings?.data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {listings.data.results.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <div className="glass-card-dark bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] py-32 flex flex-col items-center justify-center rounded-3xl mt-12">
           <div className="w-20 h-20 mb-6 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-slate-700">
             <GhostIcon size={40} />
           </div>
           <h3 className="text-2xl font-black text-white mb-2">Zero Drops Found</h3>
           <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px]">Recalibrate your scanners or adjust filters.</p>
        </div>
      )}
    </div>
  )
}

export default BrowseListings
