import axiosInstance from './axiosInstance'

export const getOrders = () => axiosInstance.get('/orders/')
export const getOrder = (id) => axiosInstance.get(`/orders/${id}/`)
export const updateOrderStatus = (id, status) => axiosInstance.patch(`/orders/${id}/status/`, { status })
export const updateOrderLocation = (id, lat, lng) => axiosInstance.patch(`/orders/${id}/location/`, { vendor_lat: lat, vendor_lng: lng })
export const getOrderLocation = (id) => axiosInstance.get(`/orders/${id}/location/`)
