import { useEffect, useRef, useCallback } from 'react'
import * as ordersApi from '../api/orders'

export const useGPS = (orderId, enabled = false, throttleMs = 10000) => {
  const watchId = useRef(null)
  const lastSentRef = useRef(0)
  const lastCoordsRef = useRef({ lat: null, lng: null })

  const sendLocation = useCallback((latitude, longitude) => {
    const now = Date.now()
    const prevLat = lastCoordsRef.current.lat
    const prevLng = lastCoordsRef.current.lng

    if (
      now - lastSentRef.current < throttleMs ||
      (prevLat === latitude && prevLng === longitude)
    ) {
      return
    }

    lastSentRef.current = now
    lastCoordsRef.current = { lat: latitude, lng: longitude }
    ordersApi.updateOrderLocation(orderId, latitude, longitude)
  }, [orderId, throttleMs])

  useEffect(() => {
    if (!enabled || !orderId) return

    if ('geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          sendLocation(latitude, longitude)
        },
        (error) => console.error('GPS Watch error', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      )
    }

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [orderId, enabled, sendLocation])
}
