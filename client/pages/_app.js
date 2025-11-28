import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'
import { PlacesProvider } from '../contexts/PlacesContext'

export default function App({ Component, pageProps }) {
  return (
    <PlacesProvider>
      <Component {...pageProps} />
    </PlacesProvider>
  )
}
