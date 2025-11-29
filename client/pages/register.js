import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePlaces } from '../contexts/PlacesContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from '../styles/Auth.module.css';

export default function Register() {
  const router = useRouter();
  const { login } = usePlaces();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters bevatten');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.username
      });
      
      // Create user document in Firestore
      const userData = {
        id: userCredential.user.uid,
        email: formData.email,
        username: formData.username,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // Redirect to map page after successful registration
      router.push('/kaart');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Er ging iets mis bij het registreren');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>✈️</div>
          <h1>Travel Planner</h1>
          <p>Maak een account en start je reis</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Gebruikersnaam</label>
            <input
              type="text"
              name="username"
              placeholder="jouw_naam"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="jouw@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Wachtwoord</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Bevestig wachtwoord</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Registreren...' : 'Registreren'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Heb je al een account?{' '}
            <button
              onClick={() => router.push('/login')}
              className={styles.link}
            >
              Inloggen
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

Register.authPage = true;