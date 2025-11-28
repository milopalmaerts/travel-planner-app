import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import styles from '../styles/Plekken.module.css';

export default function Plekken() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alle');

  const categories = [
    { id: 'alle', label: 'Alle', icon: '' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'cafe', label: 'Café', icon: '☕' },
    { id: 'viewpoint', label: 'Viewpoint', icon: '👁️' },
  ];

  const places = [
    {
      id: 1,
      name: 'Asia wok',
      city: 'Berlin',
      country: 'Duitsland',
      category: 'restaurant',
    },
  ];

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
          <h2 className={styles.countryTitle}>Duitsland</h2>
          {places.map((place) => (
            <div key={place.id} className={styles.placeCard}>
              <div className={styles.placeInfo}>
                <h3 className={styles.placeName}>{place.name}</h3>
                <p className={styles.placeLocation}>{place.city}</p>
                <span className={styles.categoryTag}>
                  🍽️ Restaurant
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="plekken" />
    </div>
  );
}
