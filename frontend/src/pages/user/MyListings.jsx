import { useListings } from '../../hooks/useListings'
import useAuthStore from '../../store/authStore'
import ListingCard from '../../components/listings/ListingCard'
import EmptyState from '../../components/ui/EmptyState'

const MyListings = () => {
  const { user } = useAuthStore()
  const { data: listings, isLoading } = useListings({ user: user?.id })

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
      <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">My Active Drops</h1>
      <p className="text-teal-500/70 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Manage your hardware blocks</p>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse" />)}
        </div>
      ) : listings?.data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.data.results.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      ) : (
        <EmptyState 
          title="Zero Output Found" 
          description="Your terminal logs are currently empty. No hardware initialized." 
          actionLink="/listings/create"
          actionLabel="Initialize Drop"
        />
      )}
    </div>
  )
}

export default MyListings
