import { useState } from 'react'
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders'
import { MapPinIcon, TruckIcon, CheckIcon, NavigationIcon, Loader2Icon, ZapIcon, TargetIcon } from 'lucide-react'

const MyPickups = () => {
  const { data: response, isLoading } = useOrders()
  const { mutate: updateStatus } = useUpdateOrderStatus()
  const [loadingId, setLoadingId] = useState(null)

  if (isLoading) return <div className="p-20 text-center text-teal-500/70 font-black uppercase tracking-[0.2em] text-xs">Accessing Logistics Network...</div>

  const orders = response?.data?.results?.filter(o => o.status !== 'completed') || []

  const handleUpdate = (id, newStatus) => {
    setLoadingId(id)
    updateStatus({ id, status: newStatus }, {
      onSettled: () => setLoadingId(null)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
      <header className="mb-12">
         <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Extraction Schedule</h1>
         <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px]">Manage active shipments and broadcast live GPS coordinates.</p>
      </header>

      {orders.length > 0 ? (
        <div className="space-y-6 relative z-10">
           {orders.map(order => (
              <div key={order.id} className="glass-card-dark p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all border border-white/10 hover:border-teal-500/50 bg-[#050505]/80 backdrop-blur-3xl rounded-[2.5rem]">
                 <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-3xl bg-teal-500/10 flex items-center justify-center font-black text-teal-400 text-2xl border border-teal-500/30 shadow-inner">
                       {order.listing.category[0].toUpperCase()}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tighter mb-1">{order.listing.title}</h3>
                       <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-2">
                          <div className="flex items-center gap-1 text-teal-500/70"><MapPinIcon size={12} /> {order.listing.pickup_address}</div>
                          <span className="text-white/20">•</span>
                          <div className="flex items-center gap-1 text-emerald-400 drop-shadow-[0_0_3px_#34d399]"><TruckIcon size={12} /> {order.status.replace('_', ' ')}</div>
                       </div>
                    </div>
                 </div>

                   <div className="flex flex-wrap gap-4 w-full md:w-auto mt-4 md:mt-0 items-center">
                      <button 
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.listing.pickup_address)}`, '_blank')} 
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex-grow md:flex-grow-0"
                      >
                         <NavigationIcon size={16} className="text-teal-400" /> Ping
                      </button>
                      
                      {order.status === 'pending' && (
                        <button 
                           onClick={() => handleUpdate(order.id, 'in_transit')} 
                           disabled={loadingId === order.id}
                           className="flex items-center justify-center gap-2 px-8 py-3 bg-teal-500 text-[#050505] disabled:bg-teal-500/50 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-95 transition-all flex-grow md:flex-grow-0"
                        >
                           {loadingId === order.id ? <Loader2Icon size={16} className="animate-spin" /> : <TruckIcon size={16} />}
                           Start Transit
                        </button>
                      )}

                      {order.status === 'in_transit' && (
                        <button 
                           onClick={() => handleUpdate(order.id, 'reached')} 
                           disabled={loadingId === order.id}
                           className="flex items-center justify-center gap-2 px-8 py-3 bg-amber-500 text-[#050505] disabled:bg-amber-500/50 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 transition-all flex-grow md:flex-grow-0"
                        >
                           {loadingId === order.id ? <Loader2Icon size={16} className="animate-spin" /> : <TargetIcon size={16} />}
                           At Target
                        </button>
                      )}

                      {order.status === 'reached' && (
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 animate-in zoom-in duration-300">
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="6-DIGIT OTP"
                            value={otps[order.id] || ''}
                            onChange={(e) => setOtps({...otps, [order.id]: e.target.value.replace(/\D/g, '')})}
                            className="w-24 bg-transparent border-none text-center text-white font-black tracking-[0.2em] outline-none placeholder:text-slate-600 placeholder:text-[8px] placeholder:tracking-normal"
                          />
                          <button 
                              onClick={() => handleVerify(order.id)} 
                              disabled={loadingId === order.id || (otps[order.id]?.length !== 6)}
                              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 text-[#050505] disabled:bg-emerald-500/50 disabled:opacity-50 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                          >
                              {loadingId === order.id ? <Loader2Icon size={14} className="animate-spin" /> : <ShieldCheckIcon size={14} />}
                              Verify
                          </button>
                        </div>
                      )}

                      {order.status === 'picked_up' && (
                        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
                            <ZapIcon size={16} className="fill-emerald-500 shadow-[0_0_10px_#10b981]" /> Verified Extraction
                        </div>
                      )}
                   </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="glass-card-dark bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] py-32 flex flex-col items-center justify-center text-center mt-12 rounded-[2.5rem]">
           <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-700">
             <TruckIcon size={24} />
           </div>
           <h3 className="text-xl font-black text-white mb-2 tracking-tighter">Zero Extractions Pending</h3>
           <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px]">Your routing log is currently empty.</p>
        </div>
      )}
    </div>
  )
}

export default MyPickups
