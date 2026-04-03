import axiosInstance from './axiosInstance'

export const getListings = (params) => axiosInstance.get('/listings/', { params })
export const getListing = (id) => axiosInstance.get(`/listings/${id}/`)
export const createListing = (data) => axiosInstance.post('/listings/', data)
export const updateListing = (id, data) => axiosInstance.patch(`/listings/${id}/`, data)
export const deleteListing = (id) => axiosInstance.delete(`/listings/${id}/`)
export const uploadListingImage = (id, formData) => axiosInstance.post(`/listings/${id}/image/`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
