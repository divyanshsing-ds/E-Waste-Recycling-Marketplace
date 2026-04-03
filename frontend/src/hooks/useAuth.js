import useAuthStore from '../store/authStore'
import { useMutation, useQueryClient } from 'react-query'
import * as authApi from '../api/auth'
import { toast } from 'react-hot-toast'

export const useAuth = () => {
  return useAuthStore()
}

export const useUpdateProfile = () => {
  const setUser = useAuthStore(state => state.setUser)
  return useMutation(authApi.updateProfile, {
    onSuccess: (res) => {
      setUser(res.data)
      toast.success('Profile updated successfully!')
    },
  })
}
