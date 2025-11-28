import { useRouter } from 'next/router';
import styles from '../styles/BottomNav.module.css';

export default function BottomNav({ active }) {
  const router = useRouter();

  const navItems = [
    { id: 'kaart', label: 'Kaart', icon: '🗺️', path: '/kaart' },
    { id: 'plekken', label: 'Plekken', icon: '📋', path: '/plekken' },
    { id: 'toevoegen', label: 'Toevoegen', icon: '➕', path: '/toevoegen' },
    { id: 'profiel', label: 'Profiel', icon: '👤', path: '/profiel' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${active === item.id ? styles.active : ''}`}
          onClick={() => router.push(item.path)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
