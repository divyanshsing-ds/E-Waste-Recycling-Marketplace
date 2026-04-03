import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useListing, useDeleteListing } from '../../hooks/useListings'
import { useAcceptBid, usePlaceBid, useListingBids } from '../../hooks/useBids'
import useAuthStore from '../../store/authStore'
import useWebSocket from '../../hooks/useWebSocket'
import { useQueryClient } from 'react-query'
import Button from '../../components/ui/Button'
import { MapPinIcon, CalendarIcon, TrashIcon, CheckCircleIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'

const ListingDetail = () => {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: response, isLoading: listingLoading } = useListing(id)
  const { data: bidsResponse, isLoading: bidsLoading } = useListingBids(id)
  const { mutate: deleteListing } = useDeleteListing()
  const { mutate: acceptBid, isLoading: acceptingBid } = useAcceptBid()
  const { mutate: placeBid, isLoading: placingBid } = usePlaceBid()
  const queryClient = useQueryClient()

  const wsPath = `/ws/notifications/?token=${encodeURIComponent(useAuthStore.getState().accessToken || '')}`
  const { lastMessage } = useWebSocket(wsPath)

  useEffect(() => {
    if (lastMessage) {
      // Invalidate queries to refetch data in real-time
      if (lastMessage.action === 'new_bid' || lastMessage.action === 'bid_accepted') {
        queryClient.invalidateQueries(['listing', id])
        queryClient.invalidateQueries(['bids', id])
      }
    }
  }, [lastMessage, queryClient, id])
  
  if (listingLoading) return <div className="p-20 text-center text-slate-400">Loading details...</div>
  
  const listing = response?.data
  if (!listing) return <div className="p-20 text-center text-slate-400">Listing not found.</div>

  const isOwner = user?.id === listing.user.id
  const isVendor = user?.role === 'VENDOR'
  const bids = bidsResponse?.data?.results || []

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Images & Info */}
        <div className="lg:col-span-7 space-y-8 group">
           <div className="aspect-video rounded-[2rem] bg-white/[0.02] overflow-hidden border border-white/[0.08] shadow-2xl relative">
             <img src={listing.image_url || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200'} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           </div>
           
           <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <UserIcon size={100} className="text-emerald-500" />
              </div>

              <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">{listing.title}</h1>
              
              <div className="flex flex-wrap gap-3 mb-6">
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                   {listing.category}
                 </div>
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                   {listing.condition} Condition
                 </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-base mb-8 font-medium">{listing.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                      <MapPinIcon size={16} />
                    </div>
                    <span className="font-medium text-xs">{listing.pickup_address}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                      <CalendarIcon size={16} />
                    </div>
                    <span className="font-medium text-xs">Listed {format(new Date(listing.created_at), 'MMM do, yyyy')}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Bids & Vendor Actions */}
        <div className="lg:col-span-5 space-y-8">
           {isOwner ? (
             <div className="glass-card p-8 bg-slate-900/40 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-black text-white tracking-tight">Active Bids</h2>
                   <Button variant="danger" onClick={() => deleteListing(id, { onSuccess: () => navigate('/dashboard') })} className="py-2 px-4 text-[9px] uppercase tracking-widest gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">
                     <TrashIcon size={12} /> Delete
                   </Button>
                </div>
                
                {listing.status === 'open' ? (
                   <div className="space-y-3">
                      {bids.length > 0 ? bids.map(bid => (
                        <div key={bid.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between transition-all hover:bg-white/[0.04] hover:border-emerald-500/30 group">
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-400 uppercase text-lg shadow-inner border border-emerald-500/20">
                                 {bid.vendor?.full_name?.[0] || 'V'}
                              </div>
                              <div>
                                 <div className="font-bold text-white text-sm">{bid.vendor?.full_name}</div>
                                 <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5">
                                    <span className="text-emerald-400">★ {bid.vendor?.vendor_score}</span>
                                    <span>•</span>
                                    <span>{bid.vendor?.total_reviews} rev</span>
                                 </div>
                              </div>
                           </div>
                            <div className="text-right">
                               <div className="text-xl font-black text-emerald-400 mb-1">
                                  ${bid.amount}
                               </div>
                                <Button 
                                  loading={acceptingBid || bid.isOptimistic}
                                  onClick={() => acceptBid(bid.id)} 
                                  className="py-1.5 px-4 text-[8px] uppercase tracking-wider bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                >
                                   Accept
                                </Button>
                            </div>
                        </div>
                      )) : (
                        <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                          <p className="text-slate-500 text-sm font-medium italic">No bids yet.</p>
                        </div>
                      )}
                   </div>
                ) : (
                  <div className="p-12 text-center bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                     <CheckCircleIcon size={40} className="mx-auto mb-4 text-emerald-400 opacity-50" />
                     <h3 className="text-lg font-bold text-white mb-1">Done</h3>
                     <p className="text-slate-400 text-xs">Listing closed.</p>
                  </div>
                )}
             </div>
           ) : isVendor && listing.status === 'open' ? (
             <div className="glass-card p-8 bg-emerald-500/[0.02] border-emerald-500/10">
                <h2 className="text-xl font-black text-white mb-6 tracking-tight">Bid</h2>
                <form 
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const amount = e.target.amount.value
                    if (amount) {
                      placeBid({ id, data: { amount } })
                    }
                  }}
                >
                   <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Amount ($)</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</span>
                        <input 
                          name="amount"
                          type="number" 
                          required
                          className="w-full pl-10 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all duration-300" 
                          placeholder="0.00" 
                        />
                      </div>
                   </div>
                   <Button loading={placingBid} type="submit" className="w-full py-4 text-md">Submit Bid</Button>
                   <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                     <p className="text-[8px] text-slate-600 tracking-tight uppercase">Your bid is legally binding.</p>
                   </div>
                </form>
             </div>
           ) : (
             <div className="glass-card p-12 text-center relative overflow-hidden">
                <UserIcon size={48} className="mx-auto mb-4 text-emerald-500/20" />
                <h3 className="text-xl font-bold text-white mb-3">Bid now?</h3>
                <p className="text-slate-400 text-sm mb-8">Verify your account to join.</p>
                <Link to="/login"><Button variant="secondary" className="px-10">Login</Button></Link>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default ListingDetail
