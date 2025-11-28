import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { usePlaces } from '../contexts/PlacesContext';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Map() {
  const { places } = usePlaces();
  const position = [51.5, 4.5]; // Center of Netherlands/Belgium

  // Helper function to get icon for category
  const getMarkerIcon = (category, visited, favorite) => {
    let color = '#17a2b8'; // default teal
    if (favorite) color = '#dc3545'; // red for favorites
    else if (visited) color = '#28a745'; // green for visited
    else if (category === 'restaurant') color = '#ff6f00';
    else if (category === 'cafe') color = '#7b1fa2';
    else if (category === 'viewpoint') color = '#2e7d32';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  // Simple geocoding - in production, use a real geocoding API
  const getCoordinates = (place) => {
    // Default coordinates based on city name (very simplified)
    const cityCoords = {
      'mariakerke': [51.0693, 3.6803],
      'berlin': [52.5200, 13.4050],
      'paris': [48.8566, 2.3522],
      'amsterdam': [52.3676, 4.9041],
      'london': [51.5074, -0.1278],
      'rome': [41.9028, 12.4964],
    };
    
    const cityLower = place.city.toLowerCase();
    return cityCoords[cityLower] || position;
  };

  return (
    <MapContainer 
      center={position} 
      zoom={7} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => {
        const coords = getCoordinates(place);
        return (
          <Marker 
            key={place.id} 
            position={coords}
            icon={getMarkerIcon(place.category, place.visited, place.favorite)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{place.name}</h3>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  {place.city}, {place.country}
                </p>
                {place.description && (
                  <p style={{ margin: '8px 0 4px 0', fontSize: '13px' }}>
                    {place.description}
                  </p>
                )}
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  {place.visited && <span style={{ fontSize: '12px', background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>✔️ Bezocht</span>}
                  {place.favorite && <span style={{ fontSize: '12px', background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>❤️ Favoriet</span>}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
