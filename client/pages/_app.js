import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'
import '../styles/theme.css'
import { PlacesProvider, usePlaces } from '../contexts/PlacesContext'
import { useEffect, useState } from 'react'

function AppContent({ Component, pageProps }) {
  const [theme, setTheme] = useState('light')
  const { loading } = usePlaces()

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (systemPrefersDark) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div>Laden...</div>
      </div>
    )
  }

  return (
    <>
      {!Component.authPage && (
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}
      <Component {...pageProps} />
    </>
  )
}

export default function App(props) {
  return (
    <PlacesProvider>
      <AppContent {...props} />
    </PlacesProvider>
  )
}
