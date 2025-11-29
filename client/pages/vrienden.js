import { useState } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Vrienden.module.css';

export default function Vrienden() {
  const router = useRouter();
  const { friends, demoUsers, addFriend, removeFriend } = usePlaces();
  const [activeTab, setActiveTab] = useState('ontdekken');

  const myFriendsList = demoUsers.filter(user => friends.includes(user.id));
  const discoverList = demoUsers.filter(user => !friends.includes(user.id));

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
            {myFriendsList.length === 0 ? (
              <div className={styles.emptyState}>
                <p>👥</p>
                <h3>Nog geen vrienden</h3>
                <p>Ga naar "Ontdekken" om vrienden toe te voegen!</p>
              </div>
            ) : (
              myFriendsList.map(user => (
                <FriendCard key={user.id} user={user} isFriend={true} />
              ))
            )}
          </>
        )}

        {activeTab === 'ontdekken' && (
          <>
            {discoverList.length === 0 ? (
              <div className={styles.emptyState}>
                <p>🎉</p>
                <h3>Je bent vrienden met iedereen!</h3>
                <p>Er zijn geen nieuwe gebruikers om te ontdekken.</p>
              </div>
            ) : (
              discoverList.map(user => (
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
