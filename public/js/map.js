const mapDiv = document.getElementById("map");

if (mapDiv) {

  //location name
  const location = mapDiv.dataset.location;

  // Get coordinates from dataset
  const coordinates = JSON.parse(mapDiv.dataset.coordinates);

  // Default fallback (Kolkata)
  const fallback = [22.5726, 88.3639];

  let lat = fallback[0];
  let lng = fallback[1];

  if (coordinates && coordinates.length === 2) {
    lng = coordinates[0];   // GeoJSON: [lng, lat]
    lat = coordinates[1];
  }

  // Create Map
  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Add Marker
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${location}</b>`)
    .openPopup();
}