import { useState } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Plekken.module.css';

export default function PubliekePlekken() {
  const router = useRouter();
  const { places } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');

  const categories = [
    { id: 'alle', label: 'Alle', icon: '' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'cafe', label: 'Café', icon: '☕' },
    { id: 'viewpoint', label: 'Viewpoint', icon: '👁️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'museum', label: 'Museum', icon: '🏛️' },
    { id: 'park', label: 'Park', icon: '🌳' },
    { id: 'hotel', label: 'Hotel', icon: '🏨' },
    { id: 'nightlife', label: 'Nachtleven', icon: '🎉' },
    { id: 'beach', label: 'Strand', icon: '🏖️' },
  ];

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

  // Filter alleen publieke plekken
  const publicPlaces = places.filter(place => place.isPublic);

  // Filter op zoekterm en categorie
  const filteredPlaces = publicPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'alle' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Groepeer per land
  const groupedPlaces = filteredPlaces.reduce((acc, place) => {
    if (!acc[place.country]) {
      acc[place.country] = [];
    }
    acc[place.country].push(place);
    return acc;
  }, {});

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
        <h1>Publieke Plekken</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Zoek plekken, steden, landen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${
                selectedCategory === cat.id ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon && <span className={styles.catIcon}>{cat.icon}</span>}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.placesList}>
          {Object.keys(groupedPlaces).length === 0 ? (
            <div className={styles.emptyState}>
              <p>🌍</p>
              <h3>Geen publieke plekken gevonden</h3>
              <p>Nog niemand heeft plekken gedeeld met deze filters.</p>
            </div>
          ) : (
            Object.keys(groupedPlaces).map(country => (
              <div key={country}>
                <h2 className={styles.countryTitle}>{country}</h2>
                {groupedPlaces[country].map((place) => (
                  <div key={place.id} className={styles.placeCard}>
                    <div className={styles.placeHeader}>
                      {place.photo && (
                        <img src={place.photo} alt={place.name} className={styles.placePhoto} />
                      )}
                      <div className={styles.placeInfo}>
                        <h3 className={styles.placeName}>{place.name}</h3>
                        <p className={styles.placeLocation}>{place.city}</p>
                        <span className={`${styles.categoryTag} ${styles[place.category]}`}>
                          {getCategoryIcon(place.category)} {getCategoryLabel(place.category)}
                        </span>
                        {place.description && (
                          <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                            {place.description}
                          </p>
                        )}
                      </div>
                      <div className={styles.placeStatus}>
                        <span style={{ fontSize: '20px' }}>🌐</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav active="profiel" />
    </div>
  );
}
