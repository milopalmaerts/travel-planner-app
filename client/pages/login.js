import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePlaces } from '../contexts/PlacesContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const router = useRouter();
  const { login } = usePlaces();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Redirect to map page after successful login
      router.push('/kaart');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Er ging iets mis bij het inloggen');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>✈️</div>
          <h1>Travel Planner</h1>
          <p>Plan je reizen en ontdek de wereld</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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
            {loading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Nog geen account?{' '}
            <button
              onClick={() => router.push('/register')}
              className={styles.link}
            >
              Registreren
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

Login.authPage = true;