import { useQuery, useMutation, useQueryClient } from 'react-query'
import * as listingsApi from '../api/listings'
import { toast } from 'react-hot-toast'

export const useListings = (params) => {
  return useQuery(['listings', params], () => listingsApi.getListings(params), {
    keepPreviousData: true,
  })
}

export const useListing = (id) => {
  return useQuery(['listing', id], () => listingsApi.getListing(id), {
    enabled: !!id,
  })
}

export const useCreateListing = () => {
  const queryClient = useQueryClient()
  return useMutation(listingsApi.createListing, {
    onSuccess: () => {
      queryClient.invalidateQueries('listings')
      toast.success('Listing created successfully!')
    },
    onError: () => toast.error('Failed to create listing.'),
  })
}

export const useDeleteListing = () => {
  const queryClient = useQueryClient()
  return useMutation(listingsApi.deleteListing, {
    onSuccess: () => {
      queryClient.invalidateQueries('listings')
      toast.success('Listing deleted.')
    },
  })
}
