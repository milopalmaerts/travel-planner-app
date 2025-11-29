import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePlaces } from '../contexts/PlacesContext';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const router = useRouter();
  const { login } = usePlaces();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      email: formData.email,
      username: formData.email.split('@')[0],
    });
    router.push('/kaart');
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
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Inloggen
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