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
    let emoji = '📍'; // default pin
    
    if (favorite) {
      color = '#dc3545'; // red for favorites
      emoji = '❤️';
    } else if (visited) {
      color = '#28a745'; // green for visited
      emoji = '✔️';
    } else if (category === 'restaurant') {
      color = '#ff6f00';
      emoji = '🍽️';
    } else if (category === 'cafe') {
      color = '#7b1fa2';
      emoji = '☕';
    } else if (category === 'viewpoint') {
      color = '#2e7d32';
      emoji = '👁️';
    } else if (category === 'shopping') {
      color = '#1976d2';
      emoji = '🛍️';
    } else if (category === 'museum') {
      color = '#f57f17';
      emoji = '🏛️';
    } else if (category === 'park') {
      color = '#2e7d32';
      emoji = '🌳';
    } else if (category === 'hotel') {
      color = '#c2185b';
      emoji = '🏨';
    } else if (category === 'nightlife') {
      color = '#6a1b9a';
      emoji = '🎉';
    } else if (category === 'beach') {
      color = '#00838f';
      emoji = '🏖️';
    }

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 20px;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          ">${emoji}</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  // Geocoding using address - in production, use Google Maps Geocoding API or Nominatim
  const getCoordinates = (place) => {
    // Try to use full address if available
    const fullAddress = `${place.address || ''}, ${place.city}, ${place.country}`.toLowerCase();
    
    // Specific address coordinates (you can add more as needed)
    const addressCoords = {
      'flanelstraat': [51.0693, 3.6803],
      'flanelstraat 29': [51.0693, 3.6803],
      'flanelstraat mariakerke': [51.0693, 3.6803],
      'grote markt antwerpen': [51.2194, 4.4025],
      'grand place brussels': [50.8467, 4.3525],
      'eiffel tower paris': [48.8584, 2.2945],
      'brandenburger tor berlin': [52.5163, 13.3777],
    };
    
    // Check if we have specific address coordinates
    for (const [addr, coords] of Object.entries(addressCoords)) {
      if (fullAddress.includes(addr)) {
        return coords;
      }
    }
    
    // Default coordinates based on city name
    const cityCoords = {
      'mariakerke': [51.0693, 3.6803],
      'gent': [51.0543, 3.7174],
      'antwerpen': [51.2194, 4.4025],
      'brussel': [50.8503, 4.3517],
      'berlin': [52.5200, 13.4050],
      'paris': [48.8566, 2.3522],
      'amsterdam': [52.3676, 4.9041],
      'london': [51.5074, -0.1278],
      'rome': [41.9028, 12.4964],
      'barcelona': [41.3851, 2.1734],
      'madrid': [40.4168, -3.7038],
      'lissabon': [38.7223, -9.1393],
      'wenen': [48.2082, 16.3738],
      'praag': [50.0755, 14.4378],
      'boedapest': [47.4979, 19.0402],
      'kopenhagen': [55.6761, 12.5683],
      'stockholm': [59.3293, 18.0686],
      'oslo': [59.9139, 10.7522],
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
                {place.photo && (
                  <img 
                    src={place.photo} 
                    alt={place.name} 
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      marginBottom: '8px' 
                    }} 
                  />
                )}
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
