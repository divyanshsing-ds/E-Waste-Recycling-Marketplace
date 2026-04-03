import axiosInstance from './axiosInstance'

export const getBids = (listingId) => axiosInstance.get('/bids/', { params: { listing: listingId } })
export const placeBid = (listingId, data) => axiosInstance.post('/bids/', { ...data, listing: listingId })
export const acceptBid = (bidId) => axiosInstance.post(`/bids/${bidId}/accept/`)
export const rejectBid = (bidId) => axiosInstance.post(`/bids/${bidId}/reject/`)
