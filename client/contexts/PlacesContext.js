import { createContext, useContext, useState, useEffect } from 'react';

const PlacesContext = createContext();

export function PlacesProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);

  // Load places from localStorage on mount
  useEffect(() => {
    const storedPlaces = localStorage.getItem('travelPlaces');
    if (storedPlaces) {
      setPlaces(JSON.parse(storedPlaces));
    }
    
    const storedUser = localStorage.getItem('travelUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save places to localStorage whenever they change
  useEffect(() => {
    if (places.length > 0) {
      localStorage.setItem('travelPlaces', JSON.stringify(places));
    }
  }, [places]);

  const addPlace = (place) => {
    const newPlace = {
      ...place,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      visited: false,
      favorite: false,
    };
    setPlaces([...places, newPlace]);
    return newPlace;
  };

  const updatePlace = (id, updates) => {
    setPlaces(places.map(place => 
      place.id === id ? { ...place, ...updates } : place
    ));
  };

  const deletePlace = (id) => {
    setPlaces(places.filter(place => place.id !== id));
  };

  const toggleVisited = (id) => {
    setPlaces(places.map(place =>
      place.id === id ? { ...place, visited: !place.visited } : place
    ));
  };

  const toggleFavorite = (id) => {
    setPlaces(places.map(place =>
      place.id === id ? { ...place, favorite: !place.favorite } : place
    ));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('travelUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelUser');
  };

  return (
    <PlacesContext.Provider value={{
      places,
      user,
      addPlace,
      updatePlace,
      deletePlace,
      toggleVisited,
      toggleFavorite,
      login,
      logout,
    }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
}
