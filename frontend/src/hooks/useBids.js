import { useQuery, useMutation, useQueryClient } from 'react-query'
import * as bidsApi from '../api/bids'
import { toast } from 'react-hot-toast'

export const useListingBids = (listingId) => {
  return useQuery(['bids', listingId], () => bidsApi.getBids(listingId), {
    enabled: !!listingId,
  })
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient()
  return useMutation(({ id, data }) => bidsApi.placeBid(id, data), {
    onMutate: async (newBid) => {
      await queryClient.cancelQueries(['bids', newBid.id])
      const previousBids = queryClient.getQueryData(['bids', newBid.id])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['bids', newBid.id], old => ({
        ...old,
        data: {
          ...old?.data,
          results: [{ 
            id: 'temp-' + Date.now(), 
            amount: newBid.data.amount, 
            status: 'pending',
            created_at: new Date().toISOString(),
            isOptimistic: true // marker
          }, ...(old?.data?.results || [])]
        }
      }))
      return { previousBids }
    },
    onError: (err, newBid, context) => {
      queryClient.setQueryData(['bids', newBid.id], context.previousBids)
      const msg = err.response?.data?.error || 'Failed to place bid.'
      toast.error(msg)
    },
    onSettled: (data, err, variables) => {
      queryClient.invalidateQueries(['bids', variables.id])
    }
  })
}

export const useAcceptBid = () => {
  const queryClient = useQueryClient()
  return useMutation(bidsApi.acceptBid, {
    onMutate: async (bidId) => {
      // Logic for instant status change on accept
      toast.loading('Accepting bid...', { id: 'accepting' })
      
      // We don't have the listing ID here easily, but ListingDetail handles it via its own data.
      // However, we can use invalidateQueries or setQueryData if we had the context.
    },
    onSuccess: (data, bidId) => {
      // If we had the listing ID, we could set its status to 'closed' here
      queryClient.invalidateQueries('listings')
      queryClient.invalidateQueries('orders')
      toast.success('Bid accepted! Order created.', { id: 'accepting' })
    },
    onError: () => {
      toast.error('Failed to accept bid.', { id: 'accepting' })
    }
  })
}
