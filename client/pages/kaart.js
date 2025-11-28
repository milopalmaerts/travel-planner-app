import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import BottomNav from '../components/BottomNav';
import styles from '../styles/Kaart.module.css';

const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Kaart() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Kaart</h1>
      </header>
      <div className={styles.mapContainer}>
        <MapWithNoSSR />
      </div>
      <BottomNav active="kaart" />
    </div>
  );
}
