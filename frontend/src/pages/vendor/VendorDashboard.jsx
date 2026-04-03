import { Link } from 'react-router-dom'
import { SearchIcon, TruckIcon, StarIcon, TrendingUpIcon, ArrowRightCircleIcon, ZapIcon } from 'lucide-react'
import { useListings } from '../../hooks/useListings'
import { useOrders } from '../../hooks/useOrders'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'
import ListingCard from '../../components/listings/ListingCard'

const VendorDashboard = () => {
  const { user } = useAuthStore()
  const { data: listings, isLoading: listingsLoading } = useListings({ status: 'open' })
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders()
  const allOrders = ordersResponse?.data?.results || []
  const completedOrders = allOrders.filter(o => o.status === 'completed')
  const activePickupsCount = allOrders.filter(o => o.status !== 'completed').length
  const earnings = completedOrders.reduce((sum, o) => sum + Number(o.bid?.amount || 0), 0)
  const recycledCount = completedOrders.length

  if (!user || listingsLoading || ordersLoading) {
    return <div className="p-20 text-center text-teal-500/70 font-black uppercase tracking-[0.2em] text-xs">Booting up terminal...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="flex items-center gap-6 relative z-10">
           <div className="w-24 h-24 rounded-3xl bg-[#050505] flex items-center justify-center border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.2)] relative overflow-hidden group">
              {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <span className="text-4xl text-teal-500 font-black">{user.full_name[0]}</span>}
              <div className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/0 transition-colors" />
           </div>
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-4xl font-black text-white tracking-tighter capitalize">{user?.full_name}</h1>
                 <span className="px-2 py-1 bg-teal-500 text-[#050505] text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-[0_0_15px_rgba(20,184,166,0.4)]">
                   <ZapIcon size={10} /> Verified Extractor
                 </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-bold">
                 <div className="flex items-center gap-1.5"><StarIcon size={16} className="fill-emerald-400 text-emerald-400 drop-shadow-[0_0_5px_#34d399]" /> {user?.vendor_score} Trust Rating</div>
                 <span className="text-white/20">•</span>
                 <div>{user?.total_reviews} Total Audits</div>
              </div>
           </div>
        </div>
        <div className="flex gap-4 relative z-10">
           <Link to="/vendor/browse">
             <button className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-500 text-[#050505] font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] active:scale-95 transition-all">
                <SearchIcon size={18} /> Scan Drops
             </button>
           </Link>
           <Link to="/vendor/pickups">
             <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.02] border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:border-white/20 hover:bg-white/[0.05] active:scale-95 transition-all">
                <TruckIcon size={18} /> My Extracts
             </button>
           </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
         {/* Main content: Recommended listings */}
         <div className="lg:col-span-3 space-y-12">
            <section>
               <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter">
                 <TrendingUpIcon size={24} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                 High-Value Targets
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {listings?.data?.results?.slice(0, 4).map(l => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
               </div>
            </section>
         </div>

         {/* Stats Sidebar */}
         <aside className="space-y-8">
            <div className="glass-card-dark p-10 bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-[2.5rem]">
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-teal-500/70 uppercase tracking-[0.2em] mb-10">Credits Mined This Cycle</h3>
                  <div className="flex items-start">
                     <span className="text-emerald-400 font-bold text-2xl mt-1">$</span>
                     <div className="text-6xl font-black text-white tracking-tighter mb-4">{earnings.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
                     <TrendingUpIcon size={14} /> Syncing ledger...
                  </div>
                  <Link to="/vendor/pickups" className="mt-12 flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-teal-500/30 hover:bg-white/[0.05] transition-all group">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{activePickupsCount} Pending Extracts</span>
                     <ArrowRightCircleIcon size={20} className="text-white/30 group-hover:text-teal-400 group-hover:drop-shadow-[0_0_8px_#2dd4bf]" />
                  </Link>
               </div>
               <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl mix-blend-screen" />
            </div>
            
            <div className="glass-card-dark p-10 bg-emerald-950/20 backdrop-blur-md border border-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-[2.5rem]">
               <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">System Impact</h3>
               <div className="text-white">
                  <div className="text-4xl font-black mb-1 tracking-tighter">{recycledCount} Nodes</div>
                  <p className="text-[10px] font-bold text-emerald-100/50 uppercase tracking-widest leading-relaxed">Secured and processed.</p>
               </div>
            </div>
         </aside>
      </div>
    </div>
  )
}

export default VendorDashboard
