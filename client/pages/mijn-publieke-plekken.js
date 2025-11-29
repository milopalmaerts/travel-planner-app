import { useState } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Plekken.module.css';

export default function MijnPubliekePlekken() {
  const router = useRouter();
  const { places, updatePlace } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter je eigen publieke en private plekken
  const myPublicPlaces = places.filter(place => place.isPublic);
  const myPrivatePlaces = places.filter(place => !place.isPublic);

  // Filter op zoekterm
  const filteredPublic = myPublicPlaces.filter(place => 
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPrivate = myPrivatePlaces.filter(place => 
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category) => {
    const icons = {
      restaurant: '🍽️',
      cafe: '☕',
      viewpoint: '👁️',
      shopping: '🛍️',
      museum: '🏛️',
      park: '🌳',
      hotel: '🏨',
      nightlife: '🎉',
      beach: '🏖️',
    };
    return icons[category] || '📍';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      restaurant: 'Restaurant',
      cafe: 'Café',
      viewpoint: 'Viewpoint',
      shopping: 'Shopping',
      museum: 'Museum',
      park: 'Park',
      hotel: 'Hotel',
      nightlife: 'Nachtleven',
      beach: 'Strand',
    };
    return labels[category] || category;
  };

  const togglePublic = (placeId, currentStatus) => {
    updatePlace(placeId, { isPublic: !currentStatus });
  };

  const PlaceCard = ({ place, isPublic }) => (
    <div className={styles.placeCard}>
      <div className={styles.placeHeader}>
        {place.photo && (
          <img src={place.photo} alt={place.name} className={styles.placePhoto} />
        )}
        <div className={styles.placeInfo}>
          <h3 className={styles.placeName}>{place.name}</h3>
          <p className={styles.placeLocation}>{place.city}, {place.country}</p>
          <span className={`${styles.categoryTag} ${styles[place.category]}`}>
            {getCategoryIcon(place.category)} {getCategoryLabel(place.category)}
          </span>
        </div>
        <button
          onClick={() => togglePublic(place.id, place.isPublic)}
          style={{
            background: isPublic ? '#17a2b8' : '#e0e0e0',
            color: isPublic ? 'white' : '#666',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            whiteSpace: 'nowrap',
          }}
        >
          {isPublic ? '🌐 Publiek' : '🔒 Privé'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            left: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ←
        </button>
        <h1>Mijn Plekken</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Zoek je plekken..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div style={{ padding: '0 16px', marginBottom: '12px' }}>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
            💡 Tip: Maak plekken publiek om ze te delen met andere reizigers. Ze blijven ook in je eigen lijst staan.
          </p>
        </div>

        {filteredPublic.length > 0 && (
          <div className={styles.placesList}>
            <h2 className={styles.countryTitle}>🌐 Publieke Plekken ({filteredPublic.length})</h2>
            {filteredPublic.map(place => (
              <PlaceCard key={place.id} place={place} isPublic={true} />
            ))}
          </div>
        )}

        {filteredPrivate.length > 0 && (
          <div className={styles.placesList}>
            <h2 className={styles.countryTitle}>🔒 Privé Plekken ({filteredPrivate.length})</h2>
            {filteredPrivate.map(place => (
              <PlaceCard key={place.id} place={place} isPublic={false} />
            ))}
          </div>
        )}

        {filteredPublic.length === 0 && filteredPrivate.length === 0 && (
          <div className={styles.emptyState}>
            <p>📭</p>
            <h3>Geen plekken gevonden</h3>
            <p>Voeg eerst plekken toe via het "Toevoegen" tabblad.</p>
          </div>
        )}
      </div>

      <BottomNav active="profiel" />
    </div>
  );
}
