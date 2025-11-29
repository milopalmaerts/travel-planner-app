import { useRouter } from 'next/router';
import { usePlaces } from '../../contexts/PlacesContext';
import BottomNav from '../../components/BottomNav';
import styles from '../../styles/Profiel.module.css';
import plekkenStyles from '../../styles/Plekken.module.css';

export default function VriendProfiel() {
  const router = useRouter();
  const { id } = router.query;
  const { demoUsers, toggleLikePlace, user } = usePlaces();

  const friend = demoUsers.find(u => u.id === id);

  if (!friend) {
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
          <h1>Profiel</h1>
        </header>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p>Gebruiker niet gevonden</p>
        </div>
        <BottomNav active="vrienden" />
      </div>
    );
  }

  const places = friend.places || [];
  const visitedCount = places.filter(p => p.visited).length;
  const favoritesCount = places.filter(p => p.favorite).length;
  const countriesCount = new Set(places.map(p => p.country)).size;

  const stats = [
    { label: 'Plekken', value: places.length, color: '#17a2b8' },
    { label: 'Bezocht', value: visitedCount, color: '#28a745' },
    { label: 'Favorieten', value: favoritesCount, color: '#dc3545' },
    { label: 'Landen', value: countriesCount, color: '#007bff' },
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

  const handleLike = (placeId) => {
    toggleLikePlace(placeId, friend.id);
  };

  const currentUserId = user?.id || user?.email;

  const groupedPlaces = places.reduce((acc, place) => {
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
        <h1>Profiel</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {friend.profilePhoto ? (
              <img src={friend.profilePhoto} alt={friend.username} className={styles.avatarImage} />
            ) : (
              <span className={styles.avatarIcon}>👤</span>
            )}
          </div>
          <h2 className={styles.username}>{friend.username}</h2>
          {friend.bio && <p className={styles.email}>{friend.bio}</p>}
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

        <div className={plekkenStyles.placesList} style={{ padding: '0 16px' }}>
          <h2 className={plekkenStyles.countryTitle} style={{ marginTop: '24px' }}>
            📍 {friend.username}'s Plekken
          </h2>
          
          {Object.keys(groupedPlaces).map(country => (
            <div key={country}>
              <h3 className={plekkenStyles.countryTitle} style={{ fontSize: '16px', marginTop: '16px' }}>
                {country}
              </h3>
              {groupedPlaces[country].map((place) => {
                const likes = place.likes || [];
                const hasLiked = likes.includes(currentUserId);
                const likeCount = likes.length;

                return (
                  <div key={place.id} className={plekkenStyles.placeCard}>
                    <div className={plekkenStyles.placeHeader}>
                      {place.photo && (
                        <img src={place.photo} alt={place.name} className={plekkenStyles.placePhoto} />
                      )}
                      <div className={plekkenStyles.placeInfo}>
                        <h3 className={plekkenStyles.placeName}>{place.name}</h3>
                        <p className={plekkenStyles.placeLocation}>{place.city}</p>
                        <span className={`${plekkenStyles.categoryTag} ${plekkenStyles[place.category]}`}>
                          {getCategoryIcon(place.category)} {getCategoryLabel(place.category)}
                        </span>
                        {place.description && (
                          <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                            {place.description}
                          </p>
                        )}
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={() => handleLike(place.id)}
                            style={{
                              background: hasLiked ? '#ffe0e0' : '#f5f5f5',
                              border: hasLiked ? '2px solid #dc3545' : '2px solid #e0e0e0',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.3s',
                            }}
                          >
                            {hasLiked ? '❤️' : '🤍'} {likeCount > 0 && likeCount}
                          </button>
                          {place.visited && (
                            <span style={{ fontSize: '12px', color: '#28a745' }}>
                              ✔️ Bezocht
                            </span>
                          )}
                          {place.favorite && (
                            <span style={{ fontSize: '12px', color: '#dc3545' }}>
                              ⭐ Favoriet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="vrienden" />
    </div>
  );
}
