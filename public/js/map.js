
  // Initialize the map
  const map = L.map('map').setView([61.505, -0.09], 13); // Set initial coordinates and zoom level

  // Add a base layer (e.g., OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Define station data (replace this with your actual station data)
  const stations = [
    { id: 1, name: 'Station A', latitude: 61.505, longitude: -0.09 },
    { id: 2, name: 'Station B', latitude: 51.51, longitude: -0.1 }
    // Add more stations here...
  ];

  // Loop through each station and add a marker to the map
  stations.forEach(station => {
    L.marker([station.latitude, station.longitude])
      .bindPopup(station.name) // Display station name as popup
      .addTo(map);
  });
