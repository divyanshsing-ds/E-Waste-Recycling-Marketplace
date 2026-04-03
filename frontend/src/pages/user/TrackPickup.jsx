import { useParams } from 'react-router-dom'
import { useOrder } from '../../hooks/useOrders'
import StatusTimeline from '../../components/orders/StatusTimeline'
import LiveTrackingMap from '../../components/maps/LiveTrackingMap'
import { MapPinIcon, TruckIcon, ShieldCheckIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import useWebSocket from '../../hooks/useWebSocket'
import useAuthStore from '../../store/authStore'
import { useQueryClient } from 'react-query'
import { format } from 'date-fns'

const TrackPickup = () => {
  const { id } = useParams()
  const { data: response, isLoading } = useOrder(id)
  const queryClient = useQueryClient()
  const [liveLocation, setLiveLocation] = useState(null)

  const wsPath = `/ws/notifications/?token=${encodeURIComponent(useAuthStore.getState().accessToken || '')}`
  const { lastMessage } = useWebSocket(wsPath)

  useEffect(() => {
    if (lastMessage) {
      if ((lastMessage.action === 'status_update' || lastMessage.action === 'otp_verified') && lastMessage.order_id === id) {
        queryClient.invalidateQueries(['order', id])
      }
      if (lastMessage.action === 'location_update' && lastMessage.order_id === id) {
        setLiveLocation({ lat: lastMessage.lat, lng: lastMessage.lng })
      }
    }
  }, [lastMessage, id, queryClient])

  if (isLoading) return <div className="p-20 text-center text-teal-500 font-black uppercase tracking-[0.2em] text-xs">Syncing with satellite...</div>
  
  const order = response.data
  const vendorLat = liveLocation?.lat || order.vendor_lat
  const vendorLng = liveLocation?.lng || order.vendor_lng

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 animate-in fade-in duration-700">
       <header className="mb-16">
          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Mission Status</h1>
          <div className="flex items-center gap-4 text-emerald-500/70 font-bold uppercase tracking-[0.2em] text-[10px]">
             <span>Order #{order.id.slice(0, 8)}</span>
             <span className="text-white/20">•</span>
             <span>{order.listing.title}</span>
          </div>
       </header>
       
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Status Sidebar */}
          <div className="lg:col-span-1 space-y-8 sticky top-24">
             <div className="glass-card-dark p-10 bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem]">
                <StatusTimeline status={order.status} />
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shadow-inner">
                      <TruckIcon size={24} />
                   </div>
                   <div>
                      <div className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 mb-1">Assigned Vendor</div>
                      <div className="font-bold text-white text-lg tracking-tight leading-none">{order.bid.vendor.full_name}</div>
                   </div>
                </div>
             </div>

             {order.otp && order.status !== 'picked_up' && order.status !== 'completed' && (
                <div className="glass-card-dark p-10 bg-emerald-500/[0.03] border-emerald-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
                   <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <ShieldCheckIcon size={12} /> Pickup Secret
                   </div>
                   <div className="text-5xl font-black tracking-[0.5em] text-white border-b-4 border-emerald-500/50 pb-4 select-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)]">
                      {order.otp}
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Share this code with the driver to confirm your handover.
                   </p>
                </div>
             )}
          </div>

          {/* Map & Detail */}
          <div className="lg:col-span-3 space-y-10">
             <div className="h-[600px] border border-white/10 rounded-[3rem] overflow-hidden shadow-3xl relative group">
                <LiveTrackingMap 
                   vendorLocation={{ lat: vendorLat, lng: vendorLng }}
                   pickupLocation={{ lat: order.listing.pickup_lat, lng: order.listing.pickup_lng }}
                   address={order.listing.pickup_address}
                />
                
                {/* Float Status */}
                <div className="absolute top-8 left-8 p-6 glass-card shadow-3xl border-white/10 backdrop-blur-2xl flex items-center gap-5 translate-z-0 group-hover:scale-[1.02] transition-transform duration-500">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-[#050505] shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                      <ShieldCheckIcon size={24} />
                   </div>
                   <div>
                      <div className="font-black text-white tracking-widest uppercase text-xs">Live Stream</div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Secure Telemetry Active</p>
                   </div>
                </div>
             </div>

             <div className="glass-card-dark p-10 bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                      <MapPinIcon size={28} />
                   </div>
                   <div>
                      <h4 className="font-black text-slate-500 uppercase text-[10px] tracking-[0.2em] mb-2">Extraction Point</h4>
                      <p className="text-white font-bold text-xl tracking-tight leading-none">{order.listing.pickup_address}</p>
                   </div>
                </div>
                  <div className="text-center md:text-right">
                     <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Target Handover</div>
                     <div className="text-2xl font-black text-white tracking-tighter">
                       {order.scheduled_time 
                         ? format(new Date(order.scheduled_time), 'MMM dd, h:mm a')
                         : 'Syncing Schedule...'}
                     </div>
                  </div>
             </div>
          </div>
       </div>
    </div>
  )
}

export default TrackPickup
