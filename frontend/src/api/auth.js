import axiosInstance from './axiosInstance'

export const login = (data) => axiosInstance.post('/auth/login/', data)
export const register = (data) => axiosInstance.post('/auth/register/', data)
export const getProfile = () => axiosInstance.get('/auth/profile/')
export const updateProfile = (data) => axiosInstance.patch('/auth/profile/', data)
