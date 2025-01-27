// components/locations.js
export async function getLocations() {
  const location = parseInt(localStorage.getItem("location"), 10) || 1;
  const response = await fetch('/api/getLocations'); 
  const data = await response.json();

  // Map the data into the desired format
  const formattedLocations = data.map((item) => ({
    id: item.point_id,
    latitude: item.latitude,
    longitude: item.longitude,
  }));

  return formattedLocations;
}
