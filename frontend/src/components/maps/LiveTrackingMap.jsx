import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'
import { memo, useMemo, useState, useEffect } from 'react'

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '24px',
}

const LiveTrackingMap = ({ vendorLocation, pickupLocation, address }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || ""
  })

  const [geocodedCoord, setGeocodedCoord] = useState(null)

  useEffect(() => {
    if (isLoaded && address && (!pickupLocation?.lat || pickupLocation.lat === 40.7128)) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setGeocodedCoord({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          })
        }
      })
    }
  }, [isLoaded, address, pickupLocation])

  const pickupCoord = useMemo(() => {
    if (geocodedCoord) return geocodedCoord
    if (!pickupLocation?.lat || !pickupLocation?.lng) return null
    return {
      lat: pickupLocation.lat,
      lng: pickupLocation.lng,
    }
  }, [pickupLocation, geocodedCoord])

  const vendorCoord = useMemo(() => vendorLocation?.lat ? {
    lat: vendorLocation.lat,
    lng: vendorLocation.lng
  } : null, [vendorLocation])

  if (!isLoaded) return <div className="w-full h-full bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center font-bold text-slate-400">Loading Map...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={pickupCoord || { lat: 0, lng: 0 }}
      zoom={pickupCoord ? 14 : 2}
      options={{
         disableDefaultUI: true,
         styles: [
            { "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] },
            { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] },
            { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] },
            { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
         ]
      }}
    >
      <MarkerF position={pickupCoord} label="Pickup" />
      {vendorCoord && <MarkerF position={vendorCoord} label="Vendor" />}
    </GoogleMap>
  )
}

export default memo(LiveTrackingMap)
