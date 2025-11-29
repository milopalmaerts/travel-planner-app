import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function FriendMap({ places, friendName }) {
  // Calculate center based on all places
  const getCenter = () => {
    if (!places || places.length === 0) return [51.5, 4.5];
    
    const coords = places.map(p => getCoordinates(p));
    const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
    const avgLng = coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;
    
    return [avgLat, avgLng];
  };

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

  // Geocoding using address
  const getCoordinates = (place) => {
    const fullAddress = `${place.address || ''}, ${place.city}, ${place.country}`.toLowerCase();
    
    const addressCoords = {
      'flanelstraat': [51.0693, 3.6803],
      'flanelstraat 29': [51.0693, 3.6803],
      'champ de mars': [48.8584, 2.2945],
      'eiffel tower': [48.8584, 2.2945],
      'avenue gustave eiffel': [48.8584, 2.2945],
      'boulevard haussmann': [48.8738, 2.3332],
      'piazza del colosseo': [41.8902, 12.4922],
      'colosseum': [41.8902, 12.4922],
      'piazza di trevi': [41.9009, 12.4833],
      'trevi fountain': [41.9009, 12.4833],
    };
    
    for (const [addr, coords] of Object.entries(addressCoords)) {
      if (fullAddress.includes(addr)) {
        return coords;
      }
    }
    
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
    };
    
    const cityLower = place.city.toLowerCase();
    return cityCoords[cityLower] || [51.5, 4.5];
  };

  return (
    <MapContainer 
      center={getCenter()} 
      zoom={places.length > 1 ? 6 : 12} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => {
        const coords = getCoordinates(place);
        const likes = place.likes || [];
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
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {place.visited && <span style={{ fontSize: '12px', background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>✔️ Bezocht</span>}
                  {place.favorite && <span style={{ fontSize: '12px', background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>❤️ Favoriet</span>}
                  {likes.length > 0 && <span style={{ fontSize: '12px', background: '#17a2b8', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>👍 {likes.length} likes</span>}
                </div>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                  📍 Bezocht door {friendName}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
