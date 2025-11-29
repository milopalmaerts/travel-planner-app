import { createContext, useContext, useState, useEffect } from 'react';

const PlacesContext = createContext();

export function PlacesProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [demoUsers, setDemoUsers] = useState([]);

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

    const storedFriends = localStorage.getItem('travelFriends');
    if (storedFriends) {
      setFriends(JSON.parse(storedFriends));
    }

    // Initialize demo users with Eva
    const storedDemoUsers = localStorage.getItem('travelDemoUsers');
    if (storedDemoUsers) {
      setDemoUsers(JSON.parse(storedDemoUsers));
    } else {
      // Create Eva demo user with places
      const eva = {
        id: 'demo-eva',
        username: 'eva_adventures',
        email: 'eva@travel.com',
        profilePhoto: null,
        bio: 'Travel enthusiast 🌍 | Food lover 🍴 | Adventure seeker ⛰️',
      };
      
      const evaPlaces = [
        {
          id: 'eva-1',
          userId: 'demo-eva',
          name: 'Eiffel Tower',
          category: 'viewpoint',
          address: 'Champ de Mars',
          postcode: '75007',
          city: 'Paris',
          country: 'Frankrijk',
          description: 'Amazing views from the top! Must visit at sunset.',
          isPublic: true,
          visited: true,
          favorite: true,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-2',
          userId: 'demo-eva',
          name: 'Le Jules Verne',
          category: 'restaurant',
          address: 'Avenue Gustave Eiffel',
          postcode: '75007',
          city: 'Paris',
          country: 'Frankrijk',
          description: 'Fine dining restaurant in the Eiffel Tower. Expensive but worth it!',
          isPublic: true,
          visited: true,
          favorite: true,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-3',
          userId: 'demo-eva',
          name: 'La Galeries Lafayette',
          category: 'shopping',
          address: '40 Boulevard Haussmann',
          postcode: '75009',
          city: 'Paris',
          country: 'Frankrijk',
          description: 'Beautiful department store with amazing rooftop views.',
          isPublic: true,
          visited: true,
          favorite: false,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-4',
          userId: 'demo-eva',
          name: 'Colosseum',
          category: 'museum',
          address: 'Piazza del Colosseo',
          postcode: '00184',
          city: 'Rome',
          country: 'Italië',
          description: 'Incredible history! Book tickets in advance to skip the line.',
          isPublic: true,
          visited: true,
          favorite: true,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-5',
          userId: 'demo-eva',
          name: 'Trevi Fountain',
          category: 'viewpoint',
          address: 'Piazza di Trevi',
          postcode: '00187',
          city: 'Rome',
          country: 'Italië',
          description: "Don't forget to throw a coin! Very crowded but magical at night.",
          isPublic: true,
          visited: true,
          favorite: false,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
      ];
      
      setDemoUsers([{ ...eva, places: evaPlaces }]);
      localStorage.setItem('travelDemoUsers', JSON.stringify([{ ...eva, places: evaPlaces }]));
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

  const updateUserProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('travelUser', JSON.stringify(updatedUser));
  };

  const addFriend = (friendId) => {
    if (!friends.includes(friendId)) {
      const newFriends = [...friends, friendId];
      setFriends(newFriends);
      localStorage.setItem('travelFriends', JSON.stringify(newFriends));
    }
  };

  const removeFriend = (friendId) => {
    const newFriends = friends.filter(id => id !== friendId);
    setFriends(newFriends);
    localStorage.setItem('travelFriends', JSON.stringify(newFriends));
  };

  const toggleLikePlace = (placeId, userId) => {
    const currentUserId = user?.id || user?.email;
    
    // Update demo user's places
    const updatedDemoUsers = demoUsers.map(demoUser => {
      if (demoUser.id === userId) {
        const updatedPlaces = demoUser.places.map(place => {
          if (place.id === placeId) {
            const likes = place.likes || [];
            const hasLiked = likes.includes(currentUserId);
            return {
              ...place,
              likes: hasLiked 
                ? likes.filter(id => id !== currentUserId)
                : [...likes, currentUserId]
            };
          }
          return place;
        });
        return { ...demoUser, places: updatedPlaces };
      }
      return demoUser;
    });
    
    setDemoUsers(updatedDemoUsers);
    localStorage.setItem('travelDemoUsers', JSON.stringify(updatedDemoUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelUser');
  };

  return (
    <PlacesContext.Provider value={{
      places,
      user,
      friends,
      demoUsers,
      addPlace,
      updatePlace,
      deletePlace,
      toggleVisited,
      toggleFavorite,
      login,
      logout,
      updateUserProfile,
      addFriend,
      removeFriend,
      toggleLikePlace,
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
