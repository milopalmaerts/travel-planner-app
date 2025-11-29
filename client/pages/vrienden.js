import { useState } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Vrienden.module.css';

export default function Vrienden() {
  const router = useRouter();
  const { friends, demoUsers, addFriend, removeFriend } = usePlaces();
  const [activeTab, setActiveTab] = useState('ontdekken');
  const [searchQuery, setSearchQuery] = useState('');

  const myFriendsList = demoUsers.filter(user => friends.includes(user.id));
  const discoverList = demoUsers.filter(user => !friends.includes(user.id));

  // Filter based on search query
  const filterUsers = (users) => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      (user.bio && user.bio.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  };

  const filteredFriends = filterUsers(myFriendsList);
  const filteredDiscover = filterUsers(discoverList);

  const FriendCard = ({ user, isFriend }) => {
    const placeCount = user.places?.length || 0;
    const visitedCount = user.places?.filter(p => p.visited).length || 0;

    return (
      <div className={styles.friendCard}>
        <div className={styles.friendAvatar}>
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.username} className={styles.friendAvatarImg} />
          ) : (
            <span>👤</span>
          )}
        </div>
        <div className={styles.friendInfo}>
          <div className={styles.friendName}>{user.username}</div>
          {user.bio && <div className={styles.friendBio}>{user.bio}</div>}
          <div className={styles.friendStats}>
            📍 {placeCount} plekken • ✔️ {visitedCount} bezocht
          </div>
        </div>
        {isFriend ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={styles.viewBtn}
              onClick={() => router.push(`/vriend-profiel/${user.id}`)}
            >
              Bekijk
            </button>
            <button 
              className={styles.removeBtn}
              onClick={() => removeFriend(user.id)}
            >
              Verwijder
            </button>
          </div>
        ) : (
          <button 
            className={styles.addBtn}
            onClick={() => addFriend(user.id)}
          >
            + Voeg toe
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Vrienden</h1>
      </header>

      <div className={styles.content}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍 Zoek vrienden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.3s',
              background: 'white',
            }}
            onFocus={(e) => e.target.style.borderColor = '#17a2b8'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'vrienden' ? styles.active : ''}`}
            onClick={() => setActiveTab('vrienden')}
          >
            Mijn Vrienden ({myFriendsList.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'ontdekken' ? styles.active : ''}`}
            onClick={() => setActiveTab('ontdekken')}
          >
            Ontdekken ({discoverList.length})
          </button>
        </div>

        {activeTab === 'vrienden' && (
          <>
            {filteredFriends.length === 0 ? (
              <div className={styles.emptyState}>
                {searchQuery ? (
                  <>
                    <p>🔍</p>
                    <h3>Geen resultaten</h3>
                    <p>Geen vrienden gevonden met "{searchQuery}"</p>
                  </>
                ) : (
                  <>
                    <p>👥</p>
                    <h3>Nog geen vrienden</h3>
                    <p>Ga naar "Ontdekken" om vrienden toe te voegen!</p>
                  </>
                )}
              </div>
            ) : (
              filteredFriends.map(user => (
                <FriendCard key={user.id} user={user} isFriend={true} />
              ))
            )}
          </>
        )}

        {activeTab === 'ontdekken' && (
          <>
            {filteredDiscover.length === 0 ? (
              <div className={styles.emptyState}>
                {searchQuery ? (
                  <>
                    <p>🔍</p>
                    <h3>Geen resultaten</h3>
                    <p>Geen gebruikers gevonden met "{searchQuery}"</p>
                  </>
                ) : discoverList.length === 0 ? (
                  <>
                    <p>🎉</p>
                    <h3>Je bent vrienden met iedereen!</h3>
                    <p>Er zijn geen nieuwe gebruikers om te ontdekken.</p>
                  </>
                ) : null}
              </div>
            ) : (
              filteredDiscover.map(user => (
                <FriendCard key={user.id} user={user} isFriend={false} />
              ))
            )}
          </>
        )}
      </div>

      <BottomNav active="vrienden" />
    </div>
  );
}
