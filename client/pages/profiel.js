import { useRouter } from 'next/router';
import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Profiel.module.css';

export default function Profiel() {
  const router = useRouter();
  const { places, user, logout, updateUserProfile } = usePlaces();
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const visitedCount = places.filter(p => p.visited).length;
  const favoritesCount = places.filter(p => p.favorite).length;
  const countriesCount = new Set(places.map(p => p.country)).size;

  const stats = [
    { label: 'Plekken', value: places.length, color: '#17a2b8' },
    { label: 'Bezocht', value: visitedCount, color: '#28a745' },
    { label: 'Favorieten', value: favoritesCount, color: '#dc3545' },
    { label: 'Landen', value: countriesCount, color: '#007bff' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ profilePhoto: reader.result });
        setIsEditingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Profiel</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.profileHeader}>
          <div 
            className={styles.avatar}
            onClick={() => setIsEditingPhoto(true)}
          >
            {user?.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.avatarIcon}>👤</span>
            )}
            <div className={styles.avatarOverlay}>
              <span>📷</span>
            </div>
          </div>
          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          {isEditingPhoto && (
            <button 
              className={styles.uploadBtn}
              onClick={() => document.getElementById('profilePhotoInput').click()}
            >
              📷 Foto uploaden
            </button>
          )}
          <h2 className={styles.username}>{user?.username || 'milo_palmaerts'}</h2>
          <p className={styles.email}>{user?.email || 'milo.palmaerts@gmail.com'}</p>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Over Travel Places</h3>
          
          <button 
            className={styles.menuItem}
            onClick={() => router.push('/mijn-publieke-plekken')}
          >
            <span className={styles.menuIcon}>🌐</span>
            <div className={styles.menuText}>
              <strong>Deel je plekken</strong>
              <p>Maak plekken publiek zodat andere gebruikers ze kunnen ontdekken</p>
            </div>
          </button>

          <button 
            className={styles.menuItem}
            onClick={() => router.push('/publieke-plekken')}
          >
            <span className={styles.menuIcon}>🗺️</span>
            <div className={styles.menuText}>
              <strong>Bekijk anderen hun plekken</strong>
              <p>Ontdek nieuwe bestemmingen via publieke plekken van andere reizigers</p>
            </div>
          </button>

          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>🔖</span>
            <div className={styles.menuText}>
              <strong>Houd je reis bij</strong>
              <p>Markeer plekken als bezocht en bewaar je favorieten</p>
            </div>
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          
          <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <span className={styles.logoutIcon}>🚪</span>
            <span>Uitloggen</span>
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </div>

      <BottomNav active="profiel" />
    </div>
  );
}
