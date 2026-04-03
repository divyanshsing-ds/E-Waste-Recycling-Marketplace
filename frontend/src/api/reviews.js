import axiosInstance from './axiosInstance'

export const getReviews = (userId) => axiosInstance.get(`/auth/users/${userId}/reviews/`)
export const createReview = (data) => axiosInstance.post('/reviews/', data)
