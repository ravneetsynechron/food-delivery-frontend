// MapInput.jsx
import { useState } from 'react';

const MapInput = ({ onLocationChange, initialAddress }) => {
  const [locationName, setLocationName] = useState(initialAddress || '');
  // State for current map view (center + zoom)
  const [mapSrc, setMapSrc] = useState(
    `https://www.openstreetmap.org/export/embed.html?&layer=mapnik&marker=${51.505},${-0.09}`
  );

  const handleSearch = () => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
      .then(res => res.json())
      .then(results => {
        if (results && results.length > 0) {
          const result = results[0];
          const newLat = parseFloat(result.lat);
          const newLon = parseFloat(result.lon);
          // Update map view to zoom into location
          const bboxSize = 0.005; // smaller value for a closer zoom
          const bbox = `${newLon - bboxSize},${newLat - bboxSize},${newLon + bboxSize},${newLat + bboxSize}`;
          const newSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${newLat},${newLon}`;
          setMapSrc(newSrc);
          // Call parent with location data
          onLocationChange({ lat: newLat, lng: newLon }, result.display_name);
        } else {
          alert('Location not found');
        }
      });
  };

  // Set initial map view
  // When component mounts, you might want to set the initial map view based on initialAddress
  // But here, for simplicity, we initialize with a default map view.

  return (
    <div>
      <input
        type="text"
        placeholder="Enter address or location"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={handleSearch} style={{ marginBottom: '15px' }}>Search</button>
      <iframe
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        src={mapSrc}
        title="Map View"
        allowFullScreen
      />
    </div>
  );
};

export default MapInput;