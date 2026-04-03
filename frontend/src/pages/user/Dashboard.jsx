import { Link } from 'react-router-dom'
import { PlusIcon, ShoppingBagIcon, MapPinIcon, ArrowRightIcon, ZapIcon, ActivityIcon } from 'lucide-react'
import { useListings } from '../../hooks/useListings'
import { useOrders } from '../../hooks/useOrders'
import useAuthStore from '../../store/authStore'
import ListingCard from '../../components/listings/ListingCard'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { data: listings, isLoading: listingsLoading } = useListings({ user: user?.id, status: 'open' })
  const { data: orders, isLoading: ordersLoading } = useOrders()

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Welcome Back, {user?.full_name[0].toUpperCase() + user?.full_name.slice(1)}</h1>
          <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px]">Manage your active drops and track extractions.</p>
        </div>
        <Link to="/listings/create">
           <button className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-[#050505] font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all">
             <PlusIcon size={18} /> Initialize Drop
           </button>
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Listings */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">
                <ShoppingBagIcon size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                Active Drops
              </h2>
              <Link to="/listings/my" className="text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">View All</Link>
            </div>
            
            {listingsLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1, 2].map(i => <div key={i} className="h-[400px] bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse" />)}
               </div>
            ) : listings?.data?.results?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.data.results.slice(0, 4).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            ) : (
              <div className="glass-card-dark p-12 text-center border border-white/10 bg-[#050505]/80 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem]">
                <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-700">
                  <ShoppingBagIcon size={24} />
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tighter">No Active Drops</h3>
                <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Initialize a drop for your scrap hardware to begin.</p>
                <Link to="/listings/create">
                   <button className="flex items-center justify-center mx-auto gap-2 px-6 py-3 bg-white/[0.02] border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:border-white/20 hover:bg-white/[0.05] active:scale-95 transition-all">
                     Initialize Drop
                   </button>
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Tracking & Stats */}
        <aside className="space-y-8">
           <section className="glass-card-dark p-8 bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative rounded-[2.5rem]">
              <div className="relative z-10">
                 <h2 className="text-white text-lg font-black mb-6 flex items-center gap-3 tracking-tighter">
                   <MapPinIcon size={20} className="text-teal-400 drop-shadow-[0_0_8px_#2dd4bf]" />
                   Live Extracts
                 </h2>
                 {ordersLoading ? (
                    <div className="space-y-4">
                       <div className="h-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
                       <div className="h-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
                    </div>
                 ) : orders?.data?.results?.filter(o => o.status !== 'completed').length > 0 ? (
                    <div className="space-y-4">
                      {orders.data.results.filter(o => o.status !== 'completed').map(o => (
                         <Link key={o.id} to={`/orders/${o.id}/track`} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-teal-500/30 transition-all group overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 font-black border border-teal-500/20 shadow-inner">
                               {o.listing.category[0].toUpperCase()}
                            </div>
                            <div className="flex-grow">
                               <div className="text-sm font-black text-white leading-none mb-1 group-hover:text-teal-400 transition-colors">{o.listing.title}</div>
                               <div className="text-[9px] uppercase font-black text-teal-500/70 tracking-[0.2em]">{o.status.replace('_', ' ')}</div>
                            </div>
                            <ArrowRightIcon size={16} className="text-teal-500/30 group-hover:text-teal-400 transition-colors drop-shadow-[0_0_5px_#2dd4bf]" />
                         </Link>
                      ))}
                    </div>
                 ) : (
                    <div className="py-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                       <p className="text-teal-500/50 font-bold uppercase tracking-[0.2em] text-[9px]">No pending extracts in sector.</p>
                    </div>
                 )}
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3 mix-blend-screen" />
           </section>

           <section className="glass-card-dark p-8 bg-emerald-950/20 backdrop-blur-md border border-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-[2.5rem]">
              <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] flex items-center gap-2">
                <ActivityIcon size={12} /> System Impact
              </h3>
              <div className="flex items-end gap-2 mb-3">
                 <span className="text-6xl font-black text-white tracking-tighter">
                   {(orders?.data?.results?.filter(o => o.status === 'completed').length * 1.5).toFixed(1)}
                 </span>
                 <span className="text-sm font-black text-emerald-400 mb-2 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">KG CO₂</span>
              </div>
              <p className="text-[10px] text-emerald-100/50 uppercase tracking-widest leading-relaxed font-bold">
                 You've offset the energy equivalent of <span className="text-emerald-400">{(orders?.data?.results?.filter(o => o.status === 'completed').length * 180).toLocaleString()}</span> nodes processing power by extracting hardware.
              </p>
           </section>
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
