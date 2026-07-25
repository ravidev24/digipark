/** Haversine distance in km between two lat/lng points */
export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
};

export const sortAreasByDistance = (areas, userLat, userLng) =>
  areas
    .filter((a) => a.lat != null && a.lng != null)
    .map((area) => ({
      ...area,
      distanceKm: getDistanceKm(userLat, userLng, area.lat, area.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

export const getUserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const messages = {
          1: "Location permission denied. Please allow location access.",
          2: "Unable to detect your location.",
          3: "Location request timed out.",
        };
        reject(new Error(messages[err.code] || "Could not get your location."));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
