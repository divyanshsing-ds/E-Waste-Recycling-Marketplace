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
      if (lastMessage.action === 'status_update' && lastMessage.order_id === id) {
        queryClient.invalidateQueries(['order', id])
      }
      if (lastMessage.action === 'location_update' && lastMessage.order_id === id) {
        setLiveLocation({ lat: lastMessage.lat, lng: lastMessage.lng })
      }
    }
  }, [lastMessage, id, queryClient])

  if (isLoading) return <div className="p-20 text-center text-slate-400">Loading track info...</div>
  
  const order = response.data
  const vendorLat = liveLocation?.lat || order.vendor_lat
  const vendorLng = liveLocation?.lng || order.vendor_lng

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
       <h1 className="text-3xl font-black text-slate-900 mb-2">Track Your Pickup</h1>
       <p className="text-slate-500 mb-10 font-bold tracking-tight">Order #{order.id.slice(0, 8)} for {order.listing.title}</p>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Status Sidebar */}
          <div className="lg:col-span-1 glass-card p-10 h-fit sticky top-24">
             <StatusTimeline status={order.status} />
             <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-primary-600">
                   <TruckIcon size={24} />
                </div>
                <div>
                   <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Driver</div>
                   <div className="font-bold text-slate-900 leading-none">{order.bid.vendor.full_name}</div>
                </div>
             </div>
          </div>

          {/* Map & Detail */}
          <div className="lg:col-span-2 space-y-8">
             <div className="h-[500px] border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative">
                <LiveTrackingMap 
                   vendorLocation={{ lat: vendorLat, lng: vendorLng }}
                   pickupLocation={{ lat: order.listing.pickup_lat, lng: order.listing.pickup_lng }}
                   address={order.listing.pickup_address}
                />
                
                {/* Float Status */}
                <div className="absolute top-6 left-6 p-4 glass-card shadow-2xl border-white/50 backdrop-blur-xl flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white scale-110 shadow-lg shadow-emerald-500/30">
                      <ShieldCheckIcon size={20} />
                   </div>
                   <div>
                      <div className="font-black text-slate-900 tracking-tighter">Verified Recycler</div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Ensures secure disposal</p>
                   </div>
                </div>
             </div>

             <div className="glass-card p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <MapPinIcon size={24} className="text-primary-500" />
                   <div>
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Pickup Information</h4>
                      <p className="text-slate-500 font-bold text-lg">{order.listing.pickup_address}</p>
                   </div>
                </div>
                 <div className="text-right">
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Scheduled At</div>
                    <div className="text-xl font-black text-slate-900">
                      {order.scheduled_time 
                        ? format(new Date(order.scheduled_time), 'MMM dd, h:mm a')
                        : 'Not scheduled yet'}
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  )
}

export default TrackPickup
