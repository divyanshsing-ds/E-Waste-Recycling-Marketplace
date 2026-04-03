import { useQuery, useMutation, useQueryClient } from 'react-query'
import * as ordersApi from '../api/orders'
import { toast } from 'react-hot-toast'

export const useOrders = () => {
  return useQuery('orders', ordersApi.getOrders)
}

export const useOrder = (id) => {
  return useQuery(['order', id], () => ordersApi.getOrder(id), {
    enabled: !!id,
    refetchInterval: (data) => {
      if (!data) return 30000
      const status = data.data?.status
      if (status === 'completed' || status === 'cancelled') return false
      return 30000
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation(({ id, status }) => ordersApi.updateOrderStatus(id, status), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['order', variables.id])
      queryClient.invalidateQueries('orders')
      toast.success(`Status updated to ${variables.status}`)
    },
  })
}
