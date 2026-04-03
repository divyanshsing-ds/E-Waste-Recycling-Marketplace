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
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images & Info */}
        <div className="space-y-8">
           <div className="aspect-video rounded-3xl bg-slate-100 overflow-hidden border border-slate-200">
             <img src={listing.image_url || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200'} alt={listing.title} className="w-full h-full object-cover" />
           </div>
           
           <div className="glass-card p-8">
              <h1 className="text-3xl font-black text-slate-900 mb-4">{listing.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                 <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-100">
                   {listing.category}
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-100">
                   {listing.condition} Condition
                 </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">{listing.description}</p>
              
              <div className="space-y-4 border-t border-slate-100 pt-8">
                 <div className="flex items-center gap-4 text-slate-600">
                    <MapPinIcon size={20} className="text-slate-400" />
                    <span className="font-medium">{listing.pickup_address}</span>
                 </div>
                 <div className="flex items-center gap-4 text-slate-600">
                    <CalendarIcon size={20} className="text-slate-400" />
                    <span className="font-medium">Listed on {format(new Date(listing.created_at), 'MMMM do, yyyy')}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Bids & Vendor Actions */}
        <div className="space-y-8">
           {isOwner ? (
             <div className="glass-card p-8 bg-slate-900 text-white border-none shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold">Manage Listing</h2>
                   <Button variant="danger" onClick={() => deleteListing(id, { onSuccess: () => navigate('/dashboard') })} className="py-2 px-4 text-xs gap-2">
                     <TrashIcon size={14} /> Delete
                   </Button>
                </div>
                
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Bids Received</h3>
                {listing.status === 'open' ? (
                   <div className="space-y-4">
                      {bids.length > 0 ? bids.map(bid => (
                        <div key={bid.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-primary-400 uppercase">
                                 {bid.vendor?.full_name?.[0] || 'V'}
                              </div>
                              <div>
                                 <div className="font-bold">{bid.vendor?.full_name}</div>
                                 <div className="text-xs text-slate-400">
                                    {bid.vendor?.vendor_score} ★ • {bid.vendor?.total_reviews} reviews
                                 </div>
                              </div>
                           </div>
                            <div className="text-right">
                               <div className="text-xl font-black text-primary-400">
                                  ${bid.amount}
                                  {bid.isOptimistic && <span className="ml-2 text-[8px] text-slate-400 animate-pulse uppercase">Sending...</span>}
                               </div>
                                <Button 
                                  loading={acceptingBid || bid.isOptimistic}
                                  onClick={() => acceptBid(bid.id)} 
                                  className="py-1 px-3 text-[10px] mt-2 bg-emerald-600 hover:bg-emerald-700"
                                >
                                   Accept Bid
                                </Button>
                            </div>
                        </div>
                      )) : (
                        <div className="py-8 text-center text-slate-500 italic text-sm">No bids received yet.</div>
                      )}
                   </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 font-medium">
                     <CheckCircleIcon size={32} className="mx-auto mb-3 text-emerald-400" />
                     Bidding closed. Order is in progress.
                  </div>
                )}
             </div>
           ) : isVendor && listing.status === 'open' ? (
             <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Place a Bid</h2>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Bid Amount ($)</label>
                      <input 
                        name="amount"
                        type="number" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" 
                        placeholder="0.00" 
                      />
                   </div>
                   <Button loading={placingBid} type="submit" className="w-full py-4 text-lg">Send Instant Bid</Button>
                   <p className="text-xs text-slate-400 text-center">Your bid is legally binding upon acceptance.</p>
                </form>
             </div>
           ) : (
             <div className="glass-card p-10 text-center">
                <UserIcon size={40} className="mx-auto mb-4 text-slate-200" />
                <h3 className="font-bold text-slate-800">Interested in recycling?</h3>
                <p className="text-slate-500 text-sm mb-6">Log in as a verified recycler to bid on this item.</p>
                <Link to="/login"><Button variant="secondary">Check out more items</Button></Link>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default ListingDetail
