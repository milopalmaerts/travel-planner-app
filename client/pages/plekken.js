import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Plekken.module.css';

export default function Plekken() {
  const { places, deletePlace, toggleVisited, toggleFavorite } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [expandedPlace, setExpandedPlace] = useState(null);

  const categories = [
    { id: 'alle', label: 'Alle', icon: '' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'cafe', label: 'Café', icon: '☕' },
    { id: 'viewpoint', label: 'Viewpoint', icon: '👁️' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      restaurant: '🍽️',
      cafe: '☕',
      viewpoint: '👁️',
    };
    return icons[category] || '📍';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      restaurant: 'Restaurant',
      cafe: 'Café',
      viewpoint: 'Viewpoint',
    };
    return labels[category] || category;
  };

  // Filter places based on search and category
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'alle' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group places by country
  const groupedPlaces = filteredPlaces.reduce((acc, place) => {
    if (!acc[place.country]) {
      acc[place.country] = [];
    }
    acc[place.country].push(place);
    return acc;
  }, {});

  const handleDelete = (id) => {
    if (confirm('Weet je zeker dat je deze plek wilt verwijderen?')) {
      deletePlace(id);
      setExpandedPlace(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Plekken</h1>
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
              <h3>Nog geen plekken toegevoegd</h3>
              <p>Begin met het toevoegen van je favoriete plekken!</p>
            </div>
          ) : (
            Object.keys(groupedPlaces).map(country => (
              <div key={country}>
                <h2 className={styles.countryTitle}>{country}</h2>
                {groupedPlaces[country].map((place) => (
                  <div key={place.id} className={styles.placeCard}>
                    <div 
                      className={styles.placeHeader}
                      onClick={() => setExpandedPlace(expandedPlace === place.id ? null : place.id)}
                    >
                      <div className={styles.placeInfo}>
                        <h3 className={styles.placeName}>{place.name}</h3>
                        <p className={styles.placeLocation}>{place.city}</p>
                        <span className={`${styles.categoryTag} ${styles[place.category]}`}>
                          {getCategoryIcon(place.category)} {getCategoryLabel(place.category)}
                        </span>
                      </div>
                      <div className={styles.placeStatus}>
                        {place.visited && <span className={styles.statusBadge} title="Bezocht">✔️</span>}
                        {place.favorite && <span className={styles.statusBadge} title="Favoriet">❤️</span>}
                        <span className={styles.expandIcon}>
                          {expandedPlace === place.id ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>
                    
                    {expandedPlace === place.id && (
                      <div className={styles.placeDetails}>
                        {place.address && <p><strong>Adres:</strong> {place.address}</p>}
                        {place.postcode && <p><strong>Postcode:</strong> {place.postcode}</p>}
                        {place.description && <p><strong>Beschrijving:</strong> {place.description}</p>}
                        
                        <div className={styles.actionButtons}>
                          <button
                            className={`${styles.actionBtn} ${place.visited ? styles.active : ''}`}
                            onClick={() => toggleVisited(place.id)}
                          >
                            ✔️ {place.visited ? 'Bezocht' : 'Markeer als bezocht'}
                          </button>
                          <button
                            className={`${styles.actionBtn} ${place.favorite ? styles.active : ''}`}
                            onClick={() => toggleFavorite(place.id)}
                          >
                            {place.favorite ? '❤️' : '🤍'} {place.favorite ? 'Favoriet' : 'Favoriet maken'}
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => handleDelete(place.id)}
                          >
                            🗑️ Verwijderen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav active="plekken" />
    </div>
  );
}
