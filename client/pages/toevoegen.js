import { useState } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Toevoegen.module.css';

export default function Toevoegen() {
  const router = useRouter();
  const { addPlace } = usePlaces();
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    address: '',
    postcode: '',
    city: '',
    country: '',
    description: '',
    isPublic: true,
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const categories = [
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPlace(formData);
    alert('Plek opgeslagen!');
    router.push('/plekken');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Toevoegen</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.photoUpload} onClick={() => document.getElementById('photoInput').click()}>
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className={styles.photoPreviewImg} />
          ) : (
            <>
              <span className={styles.photoPlaceholder}>📷</span>
              <p>Foto toevoegen (optioneel)</p>
            </>
          )}
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Naam van de plek *</label>
          <input
            type="text"
            name="name"
            placeholder="bijv. Eiffeltoren"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Categorie *</label>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryOption} ${
                  formData.category === cat.id ? styles.selected : ''
                }`}
                onClick={() => setFormData({ ...formData, category: cat.id })}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Adres</label>
          <input
            type="text"
            name="address"
            placeholder="Straat en huisnummer"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Postcode</label>
            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={formData.postcode}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Stad *</label>
            <input
              type="text"
              name="city"
              placeholder="Stad"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Land *</label>
          <input
            type="text"
            name="country"
            placeholder="bijv. Frankrijk"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Beschrijving</label>
          <textarea
            name="description"
            placeholder="Voeg notities toe over deze plek..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className={styles.publicToggle}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleIcon}>🌐</span>
            <div>
              <strong>Publiek</strong>
              <p>Andere gebruikers kunnen deze plek zien</p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Plek opslaan
        </button>
      </form>

      <BottomNav active="toevoegen" />
    </div>
  );
}
