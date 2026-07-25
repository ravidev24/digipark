/** Parse OpenStreetMap Nominatim reverse-geocode response into name + address */
const parseNominatimResponse = (data) => {
  if (!data) return { name: "", address: "" };

  const addr = data.address || {};
  const nameParts = [
    addr.amenity,
    addr.building,
    addr.shop,
    addr.tourism,
    addr.leisure,
    addr.road,
    addr.suburb,
    addr.neighbourhood,
  ].filter(Boolean);

  const name = data.name || nameParts[0] || "Custom Parking Spot";
  const address =
    [
      addr.house_number,
      addr.road,
      addr.suburb || addr.neighbourhood,
      addr.city || addr.town || addr.village || "Chennai",
      addr.state,
      addr.postcode,
    ]
      .filter(Boolean)
      .join(", ") || data.display_name || "";

  return { name, address };
};

module.exports = { parseNominatimResponse };
